from sqlalchemy import func
from ..db.primary import primary_db as db


class PrimaryDBUtils:
    """
    This base model includes common utilities that can be helpful to any
    primary db model.
    """

    def persist(self) -> None:
        """
        Save the object to DB. This can be overwritten where neeeded.
        """
        # Check if there is a `modified_ts` column and update that
        if getattr(self, "modified_ts", None) is not None:
            self.modified_ts = func.now()

        # Save
        db.session.add(self)
        db.session.commit()
