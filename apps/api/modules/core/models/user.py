import hashlib
import os
from datetime import datetime
from uuid import uuid4

from pytz import utc
from sqlalchemy.dialects.postgresql import UUID

from ...core.db.primary import primary_db as db
from ...core.models.enums import USER_STATUS, USER_TYPE
from ...core.utils.db import PrimaryDBUtils

# =============================================================================


class CoreUser(db.Model, PrimaryDBUtils):
    """
    User model

    """

    # Identity
    # -------------------------------------------------------------------------
    id: int = db.Column(db.Integer, primary_key=True)
    uuid: UUID = db.Column(UUID(as_uuid=True), unique=True, nullable=False)
    name: str = db.Column(db.Text, nullable=False)
    email: str = db.Column(db.Text, unique=True, nullable=False)

    # Authentication
    # -------------------------------------------------------------------------
    username = db.Column(db.Text, unique=True)

    # Status
    # -------------------------------------------------------------------------
    status: USER_STATUS = db.Column(db.SmallInteger, nullable=False)
    type: USER_TYPE = db.Column(db.SmallInteger, nullable=False)

    # Relationships
    # -------------------------------------------------------------------------
    workspace_id: int = db.Column(
        db.Integer,
        db.ForeignKey(f"{os.environ["STEAGO_CORE_WORKSPACE_MODEL_TABLE"]}.id"),
        nullable=False,
    )

    # Metadata
    # -------------------------------------------------------------------------
    created_ts: datetime = db.Column(db.DateTime(timezone=True), nullable=False)
    modified_ts: datetime = db.Column(db.DateTime(timezone=True), nullable=False)

    # Class meta and hierarchy mapping
    # -------------------------------------------------------------------------
    __tablename__ = os.environ["STEAGO_CORE_USER_MODEL_TABLE"]

    # -------------------------------------------------------------------------

    def __init__(
        self, name: str, email: str, type: USER_TYPE, workspace_id: int
    ) -> None:
        self.uuid = uuid4()
        self.name = name
        self.email = email
        self.username = email
        self.type = type
        self.status = USER_STATUS.ACTIVE
        self.workspace_id = workspace_id
        self.created_ts = datetime.now(tz=utc)
        self.modified_ts = self.created_ts

    # -------------------------------------------------------------------------

    @staticmethod
    def create(name: str, email: str, type: USER_TYPE, workspace_id: int) -> "CoreUser":
        user = CoreUser(name, email, type, workspace_id)
        db.session.add(user)
        db.session.commit()
        return user

    # -------------------------------------------------------------------------

    def get_display_picture(self):
        """
        Get user display picture

        Returns:
            string: The image url of the user
        """
        return "".join(
            [
                "https://www.gravatar.com/avatar/",
                hashlib.md5(self.email.encode("utf-8")).hexdigest(),
                "?d=retro",
            ]
        )

    # -------------------------------------------------------------------------
