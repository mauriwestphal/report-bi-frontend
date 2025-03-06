import { ReactNode } from "react";
import { DashboardProgressBarStyled } from "./style";

interface IDashboardProgressBarProps {
  title: string;
  startText: string;
  icon: ReactNode;
  iconText: string;
  progressBar: {
    label: string;
    progress: number;
    footerText: string;
    color: string;
  };
  classType?: string; //dashboard_progress_bar__status_user - dashboard_progress_bar__status_client 
}

const DashboardProgressBar = ({
  title,
  icon,
  iconText,
  startText,
  progressBar,
  classType
}: IDashboardProgressBarProps) => {
  return (
    <DashboardProgressBarStyled>
      <div className={classType || "dashboard_progress_bar__status_user"}>
        <p className="title">{title}</p>
        <div className="status_information">
          <span>{startText}</span>

          <div className="loader_status__container">
            <div
              className="loader_status__progress"
              style={{
                width: `${
                  progressBar.progress > 100
                    ? 100
                    : progressBar.progress < 0
                    ? 0
                    : progressBar.progress
                }%`,
                backgroundColor: progressBar.color,
              }}
            />
            <span>{progressBar.label}</span>
          </div>

          <div className="actual_progress" style={{width:'20%'}}>
            {icon} {iconText}
          </div>
        </div>
        <div className="progress_footer_text">
          <span>{progressBar.footerText}</span>
        </div>
      </div>
    </DashboardProgressBarStyled>
  );
};

export default DashboardProgressBar;
