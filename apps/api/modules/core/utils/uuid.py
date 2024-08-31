from uuid import UUID


def is_valid_uuid(val, version=4):
    try:
        UUID(str(val), version=version)
        return True
    except ValueError:
        return False
