import os
from datetime import datetime
from uuid import uuid4

from pytz import utc
from sqlalchemy.dialects.postgresql import UUID

from ...core.db.primary import primary_db as db
from ...core.models.enums import WORKSPACE_STATUS
from ...core.utils.db import PrimaryDBUtils


# =============================================================================


class CoreWorkspace(db.Model, PrimaryDBUtils):
    """
    Workspace model

    """

    # Identity
    # -------------------------------------------------------------------------
    id: int = db.Column(db.Integer, primary_key=True)
    uuid: UUID = db.Column(UUID(as_uuid=True), unique=True, nullable=False)
    name: str = db.Column(db.Text, nullable=False)

    # Status
    # -------------------------------------------------------------------------
    status: WORKSPACE_STATUS = db.Column(db.SmallInteger, nullable=False)

    # Metadata
    # -------------------------------------------------------------------------
    created_ts: datetime = db.Column(
        db.DateTime(timezone=True), nullable=False
    )
    modified_ts: datetime = db.Column(
        db.DateTime(timezone=True), nullable=False
    )

    # Class meta and hierarchy mapping
    # -------------------------------------------------------------------------
    __tablename__ = os.environ["STEAGO_CORE_WORKSPACE_MODEL_TABLE"]

    # -------------------------------------------------------------------------

    def __init__(self, name) -> None:
        self.uuid = uuid4()
        self.name = name
        self.status = WORKSPACE_STATUS.ACTIVE
        self.created_ts = datetime.now(tz=utc)
        self.modified_ts = self.created_ts

    # -------------------------------------------------------------------------

    @staticmethod
    def create(name: str) -> "CoreWorkspace":
        workspace = CoreWorkspace(name)
        db.session.add(workspace)
        db.session.commit()
        return workspace

    # -------------------------------------------------------------------------
