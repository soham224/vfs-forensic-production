"""Add video_id to result and make camera_id nullable

Revision ID: ab12cd34ef56
Revises: df4cc068261f
Create Date: 2025-10-03 19:30:00.000000

"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision: str = "ab12cd34ef56"
down_revision: Union[str, None] = "df4cc068261f"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Add nullable video_id column with FK to videos.id
    op.add_column("result", sa.Column("video_id", sa.Integer(), nullable=True))
    op.create_foreign_key(
        "fk_result_video_id_videos",  # explicit name for reliable downgrade
        "result",
        "videos",
        ["video_id"],
        ["id"],
    )
    # Make camera_id nullable
    op.alter_column(
        "result",
        "camera_id",
        existing_type=sa.Integer(),
        nullable=True,
        existing_nullable=True,  # harmless if already nullable
    )


def downgrade() -> None:
    # Revert camera_id to NOT NULL (best-effort; adjust if historically nullable)
    op.alter_column(
        "result",
        "camera_id",
        existing_type=sa.Integer(),
        nullable=False,
        existing_nullable=True,
    )
    # Drop FK and column video_id
    op.drop_constraint(
        constraint_name="fk_result_video_id_videos",
        table_name="result",
        type_="foreignkey",
    )
    # Note: Without naming convention, multiple FKs could exist; directly drop by column next
    op.drop_column("result", "video_id")
