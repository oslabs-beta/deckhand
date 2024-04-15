import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { showModal, configureProject } from '../../deckhandSlice'
import Icon from '@mdi/react'
import { mdiCogOutline } from '@mdi/js'
import { log } from 'console'

export default function FloatNav() {
  const state = useSelector((state: any) => state.deckhand)
  const dispatch = useDispatch<any>()
  const project = state.projects.find(
    (obj: any) => obj.projectId === state.projectId
  )

  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [title, setTitle] = useState<string>(project.name)

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
        provider: project.provider,
        vpcRegion: project.vpcRegion
      })
    )
    setIsEditing(false)
  }

  return (
    <div className="active-project">
      {isEditing ? (
        <input
          autoFocus
          className="title-input"
          type="text"
          value={title}
          onBlur={updateTitle}
          onChange={editTitle}
          onKeyDown={handleKeyDown}
        />
      ) : (
        <div onClick={handleTitleClick}>{project.name} </div>
      )}

      <div
        onClick={() =>
          dispatch(showModal({ name: 'ConfigureProject', data: project }))
        }
        className="icon-container"
      >
        <Icon path={mdiCogOutline} size={0.75} className="icon" />
      </div>
    </div>
  )
}
