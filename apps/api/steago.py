"""
    Steago API
    ==========

    :copyright: (c) 2020-2024 by Clergo Inc.
    :license: AGPL-3.0 (See `/LICENSE` for more details).
    :author: Augustus D'Souza <augustus@clergo.com>

"""

"""
////////////////////////////////////////////////////////////////////////////////

PART I :
The "import-ant" part

////////////////////////////////////////////////////////////////////////////////
"""
# ruff: noqa: E402

import json
import os
import time
from datetime import timedelta

from flask import Flask, jsonify, redirect, request
from flask import g as flask_g
from flask_cors import CORS
from flask_jwt_extended import JWTManager, jwt_required
from flask_migrate import Migrate
from modules.ai.utils.prompt import load_all_prompts
from modules.core.db.primary import primary_db
from modules.core.models.user import (
    CoreUser,
    get_unified_user,
    set_unified_user,
)
from modules.core.models.workspace import (
    CoreWorkspace,
    set_unified_workspace,
    get_unified_workspace,
)
from modules.core.utils.auth import set_auth_required
from modules.core.utils.cache import cache
from modules.core.utils.compress import compress
from modules.core.utils.config import CONFIG
from modules.core.utils.log import logger

"""
////////////////////////////////////////////////////////////////////////////////

PART II :
You "con-figure" this out!

////////////////////////////////////////////////////////////////////////////////
"""

# Instantiate a Flask app
app = Flask(__name__)

# Print a pretty message on the terminal for our reference in logs
if app.debug:
    print("--> Server: Starting server in DEBUG mode.")
else:
    print("--> Server: Starting server in PRODUCTION mode.")

# Set a 'SECRET_KEY' to enable the Flask session cookies
app.config["SECRET_KEY"] = CONFIG.FLASK_SECRET_KEY

# Turn off auto-sorting of JSON keys by flask
# app.config["JSON_SORT_KEYS"] = False
app.json.sort_keys = False


"""
================================================================================
FLASK JWT EXTENDED
================================================================================
"""

# Set a 'JWT_SECRET_KEY' to protect JWT tokens
app.config["JWT_SECRET_KEY"] = os.environ.get("JWT_SECRET_KEY")

# JWT RFC recommends using 'sub' for identity claim
app.config["JWT_IDENTITY_CLAIM"] = "sub"

# Set a 'JWT_SECRET_KEY' to protect JWT tokens
app.config["JWT_TOKEN_LOCATION"] = ["headers"]

# NOTE: 10 years! What? This simple JWT auth mechanism is only for self-hosted
#       open source! Feel free to change to your own auth mechanism. We've made
#       it simple to swap in an entirely custom JWT based auth mechanism and
#       set it in the "Set auth wrapper" section below.
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(days=3650)
app.config["JWT_REFRESH_TOKEN_EXPIRES"] = timedelta(days=3650)

# Initialize JWT extension
app_jwt = JWTManager(app)


# JWT Blocklist checker
@app_jwt.token_in_blocklist_loader
def check_if_token_in_blocklist(_jwt_header, jwt_payload):
    # Open-source doesn't support blocklisting for now
    return False


@app_jwt.user_identity_loader
def user_identity_lookup(user_uuid):
    """
    Converts User objects used to create a JWT into a JSON serializable format

    Read more here:
    https://flask-jwt-extended.readthedocs.io/en/stable/automatic_user_loading/
    """
    return user_uuid


@app_jwt.user_lookup_loader
def user_lookup_callback(_jwt_header, jwt_data):
    """
    Automatically loads the User object when a JWT is present in the request.
    The loaded user is available in protected routes via `current_user`.

    Read more here:
    https://flask-jwt-extended.readthedocs.io/en/stable/automatic_user_loading/
    """
    identity = jwt_data["sub"]
    user = CoreUser.query.filter_by(uuid=identity).one_or_none()
    return user


"""
================================================================================
Set auth wrapper
================================================================================
"""

set_auth_required(jwt_required)

"""
================================================================================
SQL ALCHEMY
================================================================================
"""

app.config["SQLALCHEMY_DATABASE_URI"] = CONFIG.DATABASE_PRIMARY_POSTGRES_URI

app.config["SQLALCHEMY_ENGINE_OPTIONS"] = {
    "pool_pre_ping": True,
}

# Set additional DB config based on server mode
if app.debug:
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = True
    # app.config["SQLALCHEMY_ECHO"] = True
else:
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

primary_db.init_app(app)


migrate = Migrate(app, primary_db)


"""
================================================================================
Flask-CORS
================================================================================
"""

CORS(app, origins=CONFIG.REQUEST_ORIGINS_LIST)


"""
================================================================================
Flask-Caching
================================================================================
"""

# cache.init_app(app)
cache.init_app(app)


"""
================================================================================
Flask-Compress
================================================================================
"""

# app.config["COMPRESS_MIN_SIZE"] = 0
app.config["COMPRESS_STREAMS"] = False
compress.init_app(app)


"""
////////////////////////////////////////////////////////////////////////////////

PART III :
Devs just wanna have fn

////////////////////////////////////////////////////////////////////////////////
"""

"""
================================================================================
Special Route Wrappers
================================================================================
"""

if app.debug:

    @app.before_request
    def set_server_delay():
        """
        Set server delay before each route, if asked for.
        """
        if CONFIG.SERVER_DELAY:
            time.sleep(CONFIG.SERVER_DELAY_TIME)


@app.before_request
def inject_analytics_browser_context():
    # Get Browser context for Analytics.
    context_string = request.headers.get("C-Browser-Context", "null")
    context = json.loads(context_string)
    # print("context ->", context)

    if context and "ip" not in context:
        context["ip"] = request.environ.get(
            "HTTP_X_FORWARDED_FOR", request.remote_addr
        )

    # Skip logger warning for routes such as ping
    if (
        app.debug
        and not context
        and not request.path.startswith("/ping")
        and request.method != "OPTIONS"
    ):
        logger.warning("Unable to get browser context as it was not sent!")

    flask_g.browser_context = context


"""
================================================================================
Initialize Limiter
===============================================================================
"""

if CONFIG.FLASK_LIMITER_IS_ENABLED:
    from modules.core.utils.rate_limiter import limiter

    limiter.init_app(app)
else:
    app.config["RATELIMIT_ENABLED"] = False


@app.errorhandler(429)
def internal_error_429(error):
    return (
        jsonify(
            {
                "status": "error",
                "error": "too-many-requests",
                "message": "Too Many Requests",
            }
        ),
        429,
    )


@app.errorhandler(401)
def internal_error_401(error):
    return (
        jsonify(
            {
                "status": "error",
                "error": "unauthorized",
                "message": "Unauthorized request",
            }
        ),
        401,
    )


"""
////////////////////////////////////////////////////////////////////////////////

PART IV :
All routes lead to Steago

////////////////////////////////////////////////////////////////////////////////
"""

"""
================================================================================
Register Blueprints
================================================================================
"""

from modules.chat.routers import api_chat
from modules.core.routers import api_core

app.register_blueprint(api_core)
app.register_blueprint(api_chat)


"""
================================================================================
Model import for Alembic
================================================================================
NOTE: PLEASE KEEP THESE IMPORTS AS IS, THEY ARE FOR ALEMBIC.
      WHENEVER YOU ADD A NEW MODEL, PLEASE IMPORT IT HERE TO ENSURE IT GETS
      PICKED UP BY ALEMBIC.
"""


# AI
from modules.ai.models.prompt import AIPrompt  # noqa: F401

# Chat
from modules.chat.models.channel import ChatChannel  # noqa: F401
from modules.chat.models.message import ChatMessage  # noqa: F401
from modules.chat.models.thread import ChatThread  # noqa: F401


# Core
# from modules.core.models.user import CoreUser --> already imported above
# from modules.core.models.workspace import CoreWorkspace --> already imported above

# Load unified models
set_unified_user(CoreUser)
set_unified_workspace(CoreWorkspace)

# =====================================================================
# PROMPTS
# =====================================================================
# Create all missing prompts
with app.app_context():
    load_all_prompts(debug=app.debug)


# =====================================================================
# CORE ROUTES
# =====================================================================


@app.get("/")
def home():
    return redirect("https://steago.ai")


# ------------------------------------------------------------------------------


# Ping-pong route for status, health checks
@app.get("/ping")
def api_ping():
    return {"ping": "pong"}


# ------------------------------------------------------------------------------
