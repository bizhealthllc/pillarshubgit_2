import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom"
import { useQuery, gql } from "@apollo/client";
import { SendRequest } from "../../hooks/usePost"
import parse from 'html-react-parser';
import DataLoading from "../../components/dataLoading";
import PageHeader from '../../components/pageHeader';
import EmptyContent from '../../components/emptyContent';

var GET_COUNTRIES = gql`query ($courseId: BigInt, $customerId: String) {
  courses(id: $courseId, customerId: $customerId) {
    id
    title
    description
    thumbnail
    introduction
    published
    taskCount
    completedCount
    progress {
      currentChapter
      currentTask
      lastTaskDate
    }
    chapters {
      id
      title
      hideInOffset
      offset
      taskCount
      completedCount
      tasks {
        id
        title
        content
      }
    }
  }
}`;

const Course = () => {
  const params = useParams()
  const courseId = params.courseId;
  const customerId = params.customerId;
  const [showInto, setShowIntro] = useState(true);
  const [completing, setCompleting] = useState(false);
  const [currentStep, setCurrentStep] = useState(true);
  const [activeStep, setActiveStep] = useState(true);
  const { data, loading, error, refetch } = useQuery(GET_COUNTRIES, {
    variables: { courseId: Number(courseId), customerId: customerId },
    fetchPolicy: 'no-cache'
  });

  useEffect(() => {
    if (data) {
      if (!data?.courses?.[0].introduction) setShowIntro(false);
      setCurrentStep(data?.courses?.[0].progress);
      setActiveStep({ chapter: data?.courses?.[0].progress.currentChapter, task: data?.courses?.[0].progress.currentTask, showTask: true });
      setCompleting(false);
    }
  }, [data])

  if (loading) return <DataLoading />;
  if (error) return `Error loading Documents ${error}`;
  const defaultImage = 'https://i.ytimg.com/vi/__IOTiZOG_I/maxresdefault.jpg?sqp=-oaymwEmCIAKENAF8quKqQMa8AEB-AH-CYAC0AWKAgwIABABGB8gWShyMA8=&rs=AOn4CLBSiqPHJsPX7znSy8a9pYozU_Dxfg';

  const handleStart = () => {
    setShowIntro(false);
  }

  const handleShowTask = (chapter, task, showTask) => {
    setActiveStep({ chapter, task, showTask });
  }

  const handleCompleteTask = (chapter, task) => {
    setCompleting(true);
    var progress = { courseId: courseId, chapterId: chapter, taskId: task };
    SendRequest("PUT", `/api/v1/CourseProgress/${customerId}/CompleteTask`, progress, () => {
      refetch();
    }, (error) =>{
      alert(error);
    });
  }

  const course = data?.courses?.[0] ?? {}

  return <>
    <PageHeader title={course.title} customerId={customerId} breadcrumbs={[{ title: 'Training Courses', link: `/customers/${customerId}/training` }, { title: course.title }]}>
      <div className="container-xl">
        <div className="row row-deck">
          {showInto && course.introduction &&
            <div className="col-md-6">
              <div className="card mb-3">
                <div className="img-responsive img-responsive-21x9 card-img-top" style={{ backgroundImage: `url(${(course.thumbnail ?? '') == '' ? defaultImage : course.thumbnail})` }} ></div>
                <div className="card-body">
                  {parse(course.introduction)}
                </div>
                <div className="card-footer">
                  <div className="d-flex">
                    <a href={`/customers/${customerId}/training`} className="btn btn-link">Cancel</a>
                    <button className="btn btn-primary ms-auto" onClick={handleStart}>{course.completedCount > 0 ? 'Continue' : 'Start'} Course </button>
                  </div>
                </div>
              </div>
            </div>}
          {!showInto && <>
            <div className="col-md-3">
              <div className="card">
                <div className="">
                  <div className="card-body accordion" id="accordion-example">
                    <div className="steps steps-counter steps-vertical">

                      {course?.chapters && course.chapters.map((chapter) => {
                        const active = chapter.id == currentStep.currentChapter;
                        const nextChapter = chapter.id > currentStep.currentChapter;
                        const activeIndex = chapter.id < currentStep.currentChapter ? (chapter.taskCount - 1) : currentStep.currentTask;
                        return <div key={chapter.id} className={`step-item step-counter-item ${active ? 'active' : ''}`}>

                          <a href="#" className="text-body d-block text-decoration-none" data-bs-toggle="collapse" data-bs-target={`#collapse_${chapter.id}`} aria-controls={`collapse_${chapter.id}`} aria-expanded="true">
                            <h3 className="m-0 p-0">{chapter.title}</h3>
                            <div className="text-muted text-truncate mt-n1">{chapter.completedCount}/{chapter.taskCount} Completed</div>
                          </a>

                          <div id={`collapse_${chapter.id}`} data-bs-parent="#accordion-example" className={`accordion-collapse collapse ${active ? 'show' : ''}`}>
                            <div className="card card-borderless">
                              <ul className="steps steps-cyan steps-vertical navbar-nav mt-2">
                                <li className={`step-item ${nextChapter ? 'active' : ''} d-none`}></li>
                                {chapter.tasks && chapter.tasks.map((task, index) => {
                                  const taskActive = nextChapter ? false : activeIndex >= task.id;
                                  return <li key={`${chapter.id}_${task.id}`} className={`step-item ${activeIndex == task.id ? 'active' : ''} ${index == 0 ? 'mt-0' : ''}`}>
                                    <a href="#" className="text-reset d-block text-decoration-none" onClick={(e) => { handleShowTask(chapter.id, task.id, taskActive); e.preventDefault(); }}>
                                      <div className="m-0 p-0">{task.title}</div>
                                    </a>
                                  </li>
                                })}
                              </ul>
                            </div>
                          </div>
                        </div>
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">
                    <ol className="breadcrumb breadcrumb-bullets" aria-label="breadcrumbs">
                      {/* <li className="breadcrumb-item">{course.chapters?.[activeStep.chapter]?.title}</li> */}
                      <li className="breadcrumb-item">{course.chapters?.[activeStep.chapter]?.tasks?.[activeStep.task]?.title}</li>
                    </ol>
                  </h3>
                  <div className="card-actions">
                    <span>Task {course.completedCount + 1}/{course.taskCount}</span>
                  </div>
                </div>
                <div className="card-body">
                  {activeStep.showTask && parse(course.chapters?.[activeStep.chapter]?.tasks?.[activeStep.task]?.content ?? '')}
                  {!activeStep.showTask && <>
                    <EmptyContent title="Task not available" text="This task is not available until the previouse task has been complted" />
                  </>}
                </div>
                <div className="d-flex">
                  {completing && <a href="#" className="card-btn" onClick={(e) => { e.preventDefault(); }}><div className="spinner-border spinner-border-sm me-2" role="status"></div> Completing Task</a>}
                  {!completing && activeStep.showTask && <a href="#" className="card-btn" onClick={(e) => { handleCompleteTask(activeStep.chapter, activeStep.task); e.preventDefault(); }}>Mark Completed</a>}
                </div>
              </div>
            </div>
          </>}
        </div>
      </div>
    </PageHeader >
  </>
}

export default Course;