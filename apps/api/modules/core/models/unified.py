"""
Unified protocol classes serve a base reference for User and Workspace models.

Child models can have additional attributes and methods, but need to have at
least the ones mentioned, and with the same function signatures.
"""

from datetime import datetime
from typing import Protocol

from sqlalchemy.dialects.postgresql import UUID

from ...core.db.primary import primary_db as db
from ...core.models.enums import USER_STATUS, USER_TYPE, WORKSPACE_STATUS
from ...core.utils.db import PrimaryDBUtils

# =============================================================================


class UnifiedUserProtocol(db.Model, PrimaryDBUtils, Protocol):

    __abstract__ = True  # Ensures that this protocol isn’t treated as a real model by SQLAlchemy

    # Identity
    # -------------------------------------------------------------------------
    id: int
    uuid: UUID
    name: str
    email: str

    # Authentication
    # -------------------------------------------------------------------------
    username: str

    # Status
    # -------------------------------------------------------------------------
    status: USER_STATUS
    type: USER_TYPE

    # Relationships
    # -------------------------------------------------------------------------
    workspace_id: int

    # Metadata
    # -------------------------------------------------------------------------
    created_ts: datetime
    modified_ts: datetime

    # Class meta and hierarchy mapping
    # -------------------------------------------------------------------------
    __tablename__: str

    # -------------------------------------------------------------------------

    def __init__(
        self, name: str, email: str, type: USER_TYPE, workspace_id: int
    ) -> None:
        raise NotImplementedError

    # -------------------------------------------------------------------------

    @staticmethod
    def create(
        name: str, email: str, type: USER_TYPE, workspace_id: int
    ) -> "UnifiedUserProtocol":
        raise NotImplementedError

    # -------------------------------------------------------------------------

    def get_display_picture(self) -> str:
        raise NotImplementedError


# =============================================================================


UnifiedUser: UnifiedUserProtocol = None


def set_unified_user(cls):
    global UnifiedUser
    UnifiedUser = cls


def get_unified_user() -> UnifiedUserProtocol:
    return UnifiedUser


# =============================================================================


class UnifiedWorkspaceProtocol(db.Model, PrimaryDBUtils, Protocol):
    __abstract__ = True  # Ensures that this protocol isn’t treated as a real model by SQLAlchemy

    # Identity
    # -------------------------------------------------------------------------
    id: int
    uuid: UUID
    name: str

    # Status
    # -------------------------------------------------------------------------
    status: WORKSPACE_STATUS

    # Metadata
    # -------------------------------------------------------------------------
    created_ts: datetime
    modified_ts: datetime

    # Class meta and hierarchy mapping
    # -------------------------------------------------------------------------
    __tablename__: str

    # -------------------------------------------------------------------------

    def __init__(self, name) -> None:
        raise NotImplementedError

    # -------------------------------------------------------------------------

    @staticmethod
    def create(name: str) -> "UnifiedWorkspaceProtocol":
        raise NotImplementedError

    # -------------------------------------------------------------------------

    def get_display_picture(self) -> str:
        raise NotImplementedError


# =============================================================================


UnifiedWorkspace: UnifiedWorkspaceProtocol = None


def set_unified_workspace(cls):
    global UnifiedWorkspace
    UnifiedWorkspace = cls


def get_unified_workspace() -> UnifiedWorkspaceProtocol:
    return UnifiedWorkspace


# =============================================================================
