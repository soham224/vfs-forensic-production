from pydantic import BaseModel


class ResultTypeBaseSchema(BaseModel):
    id: int
    result_type: str

    class Config:
        orm_mode = True
