from enum import Enum


class WORKSPACE_STATUS(int, Enum):
    """
    Represents status of workspace.
    """

    # New and unactivated workspace (placeholder state in case we need it later)
    NEW = 0

    # Workspace is Active (Sign in allowed, everything works)
    ACTIVE = 1

    # Workspace is temporarily suspended and sign in is restricted
    SUSPENDED = 2

    # Workspace is suspended but users can sign in and access specific pages
    # (placeholder state in case we need it later)
    ON_HOLD = 3

    # Workspace is marked for permanent deletion (taken care of by worker / cron)
    DELETED = 4


class USER_STATUS(int, Enum):
    """
    Represents status of user account.
    """

    # ACTIVE -> User can sign in
    ACTIVE = 0
    # UNVERIFIED -> Currently not used
    # Future usage: User cannot sign in unless they verify
    UNVERIFIED = 1
    # SUSPENDED -> User can't sign in
    SUSPENDED = 2
    # DELETED -> User has no access, marked for deletion.
    DELETED = 3


class USER_TYPE(int, Enum):
    """
    User type
    """

    HUB_USER = 0
    SUPER_ADMIN = 1
