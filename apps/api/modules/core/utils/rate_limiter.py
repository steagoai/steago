from .config import CONFIG
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

limiter = Limiter(
    get_remote_address,
    storage_uri=CONFIG.DATABASE_FLASK_LIMITER_REDIS_URI,
    storage_options={"socket_connect_timeout": 30},
    strategy="fixed-window",  # or "moving-window"
)


def flush_limiter_cache():
    limiter.reset()
    # storage_uri = CONFIG.DATABASE_FLASK_LIMITER_REDIS_URI
    # r = redis.StrictRedis.from_url(storage_uri)
    # r.flushall()
