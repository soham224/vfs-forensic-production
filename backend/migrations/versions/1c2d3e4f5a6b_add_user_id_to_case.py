"""Add user_id to case for per-user scoping

Revision ID: 1c2d3e4f5a6b
Revises: df4cc068261f
Create Date: 2025-02-15 00:00:00.000000
"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision: str = "1c2d3e4f5a6b"
down_revision: Union[str, None] = "df4cc068261f"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("case", sa.Column("user_id", sa.Integer(), nullable=True))
    op.create_foreign_key(
        "fk_case_user_id_user",
        "case",
        "user",
        ["user_id"],
        ["id"],
        ondelete="SET NULL",
    )


def downgrade() -> None:
    op.drop_constraint("fk_case_user_id_user", "case", type_="foreignkey")
    op.drop_column("case", "user_id")
