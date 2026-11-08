import React from 'react';
import {
  Plus,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Trash2
} from 'lucide-react';
import { StaffMember, TaskItem } from '../../types';

// TODO: remove old dispatch progression comments
// type OldStatus = 'QUEUED' | 'IN_PROGRESS' | 'RESOLVED';

interface TasksViewProps {
  currentUser: StaffMember;
  taskList: TaskItem[];
  filteredTasks: TaskItem[];
  taskProgress: {
    total: number;
    completed: number;
    inProgress: number;
    pending: number;
    urgent: number;
    percent: number;
  };
  taskAssigneeFilter: 'All' | 'Mine';
  setTaskAssigneeFilter: (filter: 'All' | 'Mine') => void;
  taskPriorityFilter: string;
  setTaskPriorityFilter: (priority: string) => void;
  mobileTaskCol: 'Pending' | 'In Progress' | 'Completed';
  setMobileTaskCol: (col: 'Pending' | 'In Progress' | 'Completed') => void;
  setNewTaskModalOpen: (open: boolean) => void;
  onMoveTask: (taskId: string, newStatus: 'Pending' | 'In Progress' | 'Completed') => void;
  onDeleteTask: (taskId: string) => void;
}

export const TasksView: React.FC<TasksViewProps> = ({
  currentUser,
  taskList,
  filteredTasks,
  taskProgress,
  taskAssigneeFilter,
  setTaskAssigneeFilter,
  taskPriorityFilter,
  setTaskPriorityFilter,
  mobileTaskCol,
  setMobileTaskCol,
  setNewTaskModalOpen,
  onMoveTask,
  onDeleteTask
}) => {
  return (
    <div>
      <div className="page-header">
        <div className="page-title-group">
          <h1>Tasks &amp; Deliverables</h1>
          <p>Assign responsibilities, track research deliverables, and monitor completion deadlines.</p>
        </div>
        <div className="header-actions">
          <button className="btn-primary" onClick={() => setNewTaskModalOpen(true)}>
            <Plus size={16} />
            <span>Create Task</span>
          </button>
        </div>
      </div>

      {/* Admin Task Progress Monitor Strip */}
      <div className="task-monitor-panel">
        <div className="task-monitor-header">
          <div>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>
              TASK COMPLETION PROGRESS
            </span>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginLeft: '8px' }}>
              {taskProgress.completed} of {taskProgress.total} tasks completed ({taskProgress.percent}%)
            </span>
          </div>
          <div className="task-stats-chips">
            <span className="task-stat-chip">
              Pending: <strong>{taskProgress.pending}</strong>
            </span>
            <span className="task-stat-chip">
              In Progress: <strong>{taskProgress.inProgress}</strong>
            </span>
            <span className="task-stat-chip">
              Completed: <strong>{taskProgress.completed}</strong>
            </span>
            {taskProgress.urgent > 0 && (
              <span className="status-pill lost" style={{ padding: '2px 8px', fontSize: '10px' }}>
                <AlertCircle size={11} /> {taskProgress.urgent} Urgent
              </span>
            )}
          </div>
        </div>
        <div className="task-progress-bar-track">
          <div
            className="task-progress-bar-fill"
            style={{ width: `${taskProgress.percent}%` }}
          />
        </div>
      </div>

      {/* Task View Filters */}
      <div className="filter-toolbar">
        <div className="filter-group">
          <button
            className={`filter-tab-btn ${taskAssigneeFilter === 'All' ? 'active' : ''}`}
            onClick={() => setTaskAssigneeFilter('All')}
          >
            All Tasks ({taskList.length})
          </button>
          <button
            className={`filter-tab-btn ${taskAssigneeFilter === 'Mine' ? 'active' : ''}`}
            onClick={() => setTaskAssigneeFilter('Mine')}
          >
            My Assigned Responsibilities ({taskList.filter(t => t.assignee.toLowerCase() === currentUser.name.toLowerCase()).length})
          </button>
        </div>

        <div className="category-select-wrap">
          <select
            className="category-dropdown"
            value={taskPriorityFilter}
            onChange={e => setTaskPriorityFilter(e.target.value)}
            aria-label="Filter tasks by priority"
          >
            <option value="All">All Priorities</option>
            <option value="Urgent">Urgent Priority</option>
            <option value="High">High Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="Low">Low Priority</option>
          </select>
        </div>
      </div>

      {/* Mobile Segmented Column Tabs */}
      <div className="mobile-column-tabs">
        {(['Pending', 'In Progress', 'Completed'] as const).map(col => (
          <button
            key={col}
            className={`column-tab-btn ${mobileTaskCol === col ? 'active' : ''}`}
            onClick={() => setMobileTaskCol(col)}
          >
            <span>{col}</span>
            <span className="tab-counter">
              {filteredTasks.filter(t => t.status === col).length}
            </span>
          </button>
        ))}
      </div>

      {/* Kanban Grid */}
      <div className="kanban-grid">
        {(['Pending', 'In Progress', 'Completed'] as const).map(column => {
          const tasksInCol = filteredTasks.filter(t => t.status === column);
          return (
            <div
              key={column}
              className={`kanban-column ${mobileTaskCol === column ? 'mobile-visible-col' : 'mobile-hidden-col'}`}
            >
              <div className="kanban-column-header">
                <div className="column-title-wrap">
                  <span>{column}</span>
                  <span className="column-counter">{tasksInCol.length}</span>
                </div>
                <button
                  style={{ color: 'var(--text-muted)' }}
                  onClick={() => setNewTaskModalOpen(true)}
                  aria-label="Add task to column"
                >
                  <Plus size={16} />
                </button>
              </div>

              {tasksInCol.map(task => (
                <div key={task.id} className="task-card">
                  <div className="task-card-header">
                    <span className={`priority-badge ${task.priority.toLowerCase()}`}>
                      {task.priority} Priority
                    </span>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      {task.dueDate}
                    </span>
                  </div>

                  <h4 className="task-title">{task.title}</h4>
                  <p className="task-desc">{task.description}</p>

                  <div className="task-card-footer">
                    <div className="task-assignee">
                      <div className="user-avatar staff" style={{ width: 20, height: 20, fontSize: 9 }}>
                        {task.assigneeInitials}
                      </div>
                      <span>{task.assignee}</span>
                    </div>

                    <div className="task-controls">
                      {column !== 'Pending' && (
                        <button
                          className="task-move-btn"
                          onClick={() => onMoveTask(task.id, column === 'Completed' ? 'In Progress' : 'Pending')}
                          title="Move Left"
                          aria-label="Move task left"
                        >
                          <ChevronLeft size={13} />
                        </button>
                      )}
                      {column !== 'Completed' && (
                        <button
                          className="task-move-btn"
                          onClick={() => onMoveTask(task.id, column === 'Pending' ? 'In Progress' : 'Completed')}
                          title="Move Right"
                          aria-label="Move task right"
                        >
                          <ChevronRight size={13} />
                        </button>
                      )}
                      {currentUser.role === 'OWNER' && (
                        <button
                          className="task-move-btn"
                          style={{ color: 'var(--loss-red)' }}
                          onClick={() => onDeleteTask(task.id)}
                          title="Delete Task"
                          aria-label="Delete task"
                        >
                          <Trash2 size={12} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};
