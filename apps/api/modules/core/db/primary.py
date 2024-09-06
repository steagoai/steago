from sqlalchemy import MetaData
from flask_sqlalchemy import SQLAlchemy

# https://docs.sqlalchemy.org/en/20/core/constraints.html#configuring-a-naming-convention-for-a-metadata-collection
# https://gist.github.com/popravich/d6816ef1653329fb1745
# https://stackoverflow.com/questions/4107915/postgresql-default-constraint-names/4108266#4108266

# convention = {
#     "ix": "ix_%(column_0_label)s",
#     "uq": "uq_%(table_name)s_%(column_0_name)s",
#     "ck": "ck_%(table_name)s_%(constraint_name)s",
#     "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
#     "pk": "pk_%(table_name)s",
# }

convention = {
    "ix": "%(table_name)s_%(column_0_name)s_idx",
    "uq": "%(table_name)s_%(column_0_name)s_key",
    "ck": "%(table_name)s_%(column_0_name)s_check",
    "fk": "%(table_name)s_%(column_0_name)s_fkey",
    "pk": "%(table_name)s_%(column_0_name)s_pkey",
}

primary_db = SQLAlchemy(metadata=MetaData(naming_convention=convention))


def override_primary_db(db_instance: SQLAlchemy) -> None:
    global primary_db
    primary_db = db_instance
