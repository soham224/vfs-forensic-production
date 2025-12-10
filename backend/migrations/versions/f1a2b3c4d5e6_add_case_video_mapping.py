"""add case_video_mapping table

Revision ID: f1a2b3c4d5e6
Revises: 3bf8d022c917
Create Date: 2025-10-03 12:24:00.000000

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = "f1a2b3c4d5e6"
down_revision: Union[str, None] = "3bf8d022c917"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Create association table case_video_mapping
    op.create_table(
        "case_video_mapping",
        sa.Column("case_id", sa.Integer(), sa.ForeignKey("case.id"), nullable=False),
        sa.Column("video_id", sa.Integer(), sa.ForeignKey("videos.id"), nullable=False),
    )


def downgrade() -> None:
    op.drop_table("case_video_mapping")
