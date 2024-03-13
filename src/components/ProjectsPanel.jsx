// Importacion de componentes necesarios
import SearchBar from "./SearchBar";
import ProjectModal from "./ProjectModal";
import TaskModal from "./TaskModal";
import TaskCard from "./TaskCard";
import ProjectCard from "./ProjectCard";
import OptionsBox from "./OptionBox";
import EditModal from "./EditModal";

import {
  ProjectContext,
  ProjectDispatchContext,
} from "../contexts/ProjectContext";

// Importacion de los estilos

import "../styles/projectPanel.css";

// Icons FontAwesomes
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGears } from "@fortawesome/free-solid-svg-icons";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useContext, useState } from "react";

export default function ProjectsPanel() {
  const {
    showProjectModal,
    setShowProjectModal,
    showTaskModal,
    setShowTaskModal,
    projects,
    selectedProject,
    setSelectedProject,
    setVisible,
    doubleClickY,
    setDoubleClickY,
    doubleClickX,
    setDoubleClickX,
    setShowEditModal,
    showEditModal,
  } = useContext(ProjectContext);

  const dispatch = useContext(ProjectDispatchContext);

  const handleProjectModalView = () => {
    setShowProjectModal(!showProjectModal);
  };

  const handleDoubleClick = (e) => {
    const relativeX = e.clientX + 80;
    setDoubleClickX(relativeX);
    setDoubleClickY(e.clientY);
    setVisible(true);
  };

  const handleDeleteProject = () => {
    dispatch({
      type: "deleteProject",
      projectId: selectedProject.id,
    });
    setVisible(false);
    setSelectedProject(null);
  };

  const handleEditProject = () => {
    dispatch({
      type: "editProject",
      projectId: selectedProject.id,
      name: selectedProject.name,
      description: selectedProject.description,
      color: selectedProject.color
    })
    setShowEditModal(true);
    setVisible(false);
  };

  const handleTaskModalView = () => {
    setShowTaskModal(!showTaskModal);
  };

  const handleSelectedProject = (project) => {
    setSelectedProject(project);
  };

  const orgarnizeTaskByDate = (project) => {
    const tasksByDate = {};
    project.tasks.forEach((task) => {
      const date = task.dueDate;
      if (!tasksByDate[date]) {
        tasksByDate[date] = [];
      }
      tasksByDate[date].push(task);
    });
    return tasksByDate;
  };

  return (
    <>
      <OptionsBox
        onDelete={handleDeleteProject}
        onEdit={handleEditProject}
        doubleClickX={doubleClickX}
        doubleClickY={doubleClickY}
      />
      <div className="mainContainer">
        <section className="leftContainer">
          <button className="btnAll settingsBtn">
            <FontAwesomeIcon icon={faGears} />
          </button>
          <h1 className="userName">Hi! Lotus</h1>
          <p>Welcome Back to the workspace. We missed you!</p>
          <SearchBar />
          <h2>
            Projects{" "}
            <span className="numberOfProjects"> ({projects.length})</span>
          </h2>
          <div className="projectsContainer overflowPanel overflowPanelLeft">
            <button
              className="btn addProjectBtn"
              onClick={handleProjectModalView}
            >
              <FontAwesomeIcon icon={faPlus} />
            </button>
            {projects.map((project, index) => (
              <ProjectCard
                key={index}
                project={project}
                onClick={() => handleSelectedProject(project)}
                onDoubleClick={(e) => handleDoubleClick(e, project)}
              />
            ))}
          </div>
          {showProjectModal && <ProjectModal />}
          {showEditModal && <EditModal />}
        </section>
        <section className="taskContainer">
          {selectedProject && (
            <div>
              <h2 className="projectTitle">{selectedProject.name}</h2>
              <p className="projectDescription">
                {selectedProject.description}
              </p>
              <div className="overflowPanel overflowPanelRight">
                {Object.keys(orgarnizeTaskByDate(selectedProject)).map(
                  (date) => (
                    <div key={date}>
                      <h3 className="taskDate">{date}</h3>
                      <hr />
                      <ul>
                        {orgarnizeTaskByDate(selectedProject)[date].map(
                          (task, index) => (
                            <TaskCard key={index} task={task} />
                          )
                        )}
                      </ul>
                    </div>
                  )
                )}
              </div>
            </div>
          )}
          {!showTaskModal && selectedProject && (
            <button className="btnAll addTaskBtn" onClick={handleTaskModalView}>
              <FontAwesomeIcon icon={faPlus} />
            </button>
          )}
          {showTaskModal && <TaskModal />}
        </section>
      </div>
    </>
  );
}
