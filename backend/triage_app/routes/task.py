from fastapi import APIRouter, Depends, HTTPException
from .. import schemas
from sqlalchemy.orm import Session
from ..dependencies import get_db
from ..crud import create_task, delete_task, update_task, decode_agent, get_task_by_filter, get_tasks, get_role
from fastapi.responses import JSONResponse


router = APIRouter(prefix='/task')

@router.post("/create", response_model=schemas.Task)
def task_create(task: schemas.TaskCreate, db: Session = Depends(get_db), agent_data: schemas.AgentData = Depends(decode_agent)):
    if not get_role(db=db, agent_id=agent_data.agent_id, role='task.create'):
        raise HTTPException(status_code=403, detail="Access denied: You do not have permission to access this resource")    
    return create_task(db=db, task=task)


@router.get("/id/{task_id}", response_model=schemas.Task)
def get_task_by_id(task_id: int, db: Session = Depends(get_db), agent_data: schemas.AgentData = Depends(decode_agent)):
    task = get_task_by_filter(db, filter={'task_id': task_id})
    if not task:
        raise HTTPException(status_code=400, detail=f'No task found with id {task_id}')
    return task

@router.get("/get", response_model=list[schemas.Task])
def get_all_tasks(db: Session = Depends(get_db), agent_data: schemas.AgentData = Depends(decode_agent)):
    return get_tasks(db)

@router.put("/put/{task_id}", response_model=schemas.Task)
def task_update(task_id: int, updates: schemas.TaskUpdate, db: Session = Depends(get_db), agent_data: schemas.AgentData = Depends(decode_agent)):
    if not get_role(db=db, agent_id=agent_data.agent_id, role='task.edit'):
        raise HTTPException(status_code=403, detail="Access denied: You do not have permission to access this resource")
    task = update_task(db, task_id, updates)
    if not task:
        raise HTTPException(status_code=400, detail=f'Task with id {task_id} not found')
    
    return task

@router.delete("/delete/{task_id}")
def task_delete(task_id: int, db: Session = Depends(get_db), agent_data: schemas.AgentData = Depends(decode_agent)):
    if not get_role(db=db, agent_id=agent_data.agent_id, role='task.delete'):
        raise HTTPException(status_code=403, detail="Access denied: You do not have permission to access this resource")
    status = delete_task(db, task_id)
    if not status:
        raise HTTPException(status_code=400, detail=f'Task with id {task_id} not found')

    return JSONResponse(content={'message': 'success'})

