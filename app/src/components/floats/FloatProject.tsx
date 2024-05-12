import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { showModal, configureProject } from '../../deckhandSlice'

export default function FloatNav() {
  const state = useSelector((state: any) => state.deckhand)
  const dispatch = useDispatch<any>()
  const project = state.projects.find(
    (obj: any) => obj.projectId === state.projectId
  )

  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [title, setTitle] = useState<string>(project.name)

  useEffect(() => {
    if (project.showTutorial) {
      dispatch(showModal({ name: "WelcomeAboard" }))
      dispatch(
        configureProject({
          projectId: project.projectId,
          showTutorial: false,
        }))
    };
  }, [])

  const handleTitleClick = () => {
    setIsEditing(true)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') updateTitle(e)
  }

  const editTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
  }

  const updateTitle = (e: any) => {
    const newTitle = (e.target as HTMLInputElement).value
    dispatch(
      configureProject({
        projectId: project.projectId,
        name: newTitle,
      })
    )
    setIsEditing(false)
  }

  const renameIcon = <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="m15 16l-4 4h10v-4zm-2.94-8.81L3 16.25V20h3.75l9.06-9.06zM5.92 18H5v-.92L12.06 10l.94.94zm12.79-9.96c.39-.39.39-1.04 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83l3.75 3.75z"></path></svg>;
  const dividerIcon = <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 15 15"><path fill="currentColor" fillRule="evenodd" d="M7.5 2a.5.5 0 0 1 .5.5v10a.5.5 0 0 1-1 0v-10a.5.5 0 0 1 .5-.5" clipRule="evenodd"></path></svg>;
  const dropdownIcon = <svg xmlns="http://www.w3.org/2000/svg" width="0.9em" height="0.9em" viewBox="0 0 16 16"><path fill="currentColor" d="M8 12L1.68 5.68L3.35 4L8 8.65L12.65 4l1.67 1.68z"></path></svg>
  
  return (
    <div className="float-project">
      <div className="name">
      {isEditing ? (
        <input
          autoFocus
          title="title-input"
          className="title-input"
          type="text"
          value={title}
          onBlur={updateTitle}
          onChange={editTitle}
          onKeyDown={handleKeyDown}
        />
      ) : (
        <div className="title-container" onClick={handleTitleClick}>
          <span className="rename-icon">{renameIcon}</span>
          {project.name}
        </div>
        )}</div>
      <div className="divider">{dividerIcon}</div>
      <div
        className="region"
        onClick={() =>
          dispatch(showModal({ name: 'ConfigureProject', data: project }))
        }
      >
        {project.vpcRegion} {dropdownIcon}
      </div>
    </div>
  )
}
