from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from .. import schemas
# from ..crud import create_attachment, delete_attachment, decode_agent, get_attachment_by_filter, get_attachments, generate_presigned_url
from ..crud import (create_attachment, decode_agent, generate_presigned_url,
                    get_attachment_by_filter)
from ..dependencies import get_db

router = APIRouter(prefix='/attachment')

@router.post("/create", response_model=schemas.Attachment)
def attachment_create(attachment: schemas.AttachmentCreate, db: Session = Depends(get_db)):
    return create_attachment(db=db, attachment=attachment)


@router.get("/id/{attachment_id}", response_model=list[schemas.Attachment])
def get_attachment_by_id(attachment_id: int, db: Session = Depends(get_db)):
    attachment = get_attachment_by_filter(db, filter={'object_id': attachment_id})
    if not attachment:
        raise HTTPException(status_code=400, detail=f'No attachment found with id {attachment_id}')
    return attachment

# @router.get("/get", response_model=list[schemas.Attachment])
# def get_all_attachments(db: Session = Depends(get_db), agent_data: schemas.AgentData = Depends(decode_agent)):
#     return get_attachments(db)

# # @router.put("/put/{attachment_id}", response_model=schemas.Attachment)
# # def attachment_update(attachment_id: int, updates: schemas.AttachmentUpdate, db: Session = Depends(get_db), agent_data: schemas.AgentData = Depends(decode_agent)):
# #     attachment = update_attachment(db, attachment_id, updates)
# #     if not attachment:
# #         raise HTTPException(status_code=400, detail=f'Attachment with id {attachment_id} not found')
    
# #     return attachment

# @router.delete("/delete/{attachment_id}")
# def attachment_delete(attachment_id: int, db: Session = Depends(get_db), agent_data: schemas.AgentData = Depends(decode_agent)):
#     status = delete_attachment(db, attachment_id)
#     if not status:
#         raise HTTPException(status_code=400, detail=f'Attachment with id {attachment_id} not found')

#     return JSONResponse(content={'message': 'success'})

@router.post("/generate-url", response_model=schemas.AttachmentS3Url)
def generate_url(request: Request, attachment_name: schemas.AttachmentName, db: Session = Depends(get_db)):
    s3_handler = request.state.s3_client
    s3_client = s3_handler.get_client()
    if s3_client is None:
        raise HTTPException(400, f"Attachment cannot be added. S3 Credentials may be empty or not configured")
    return generate_presigned_url(db=db, attachment_name=attachment_name, s3_client=s3_client)