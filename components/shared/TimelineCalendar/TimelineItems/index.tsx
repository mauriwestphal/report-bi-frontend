import { Popover, Tooltip } from "antd";
import moment from "moment";
import DetailOrderCard from "../../DetailOrderCard";
import { TimelineItemStyle } from "./style";
import popoverInterface from "../../../../shared/interfaces/Popover.iterface";
export interface ITimelineItem {
  start: Date;
  end: Date;
  highlight?: boolean;
  title: string;
  id?: number;
  color?: string;
  popover?: popoverInterface;

}

interface ITimelineItems {
  relativeMaximum: number;
  startRelative: number;
  item: ITimelineItem;
}

const TimelineItems = ({
  relativeMaximum,
  item,
  startRelative,
}: ITimelineItems) => {

  // const end : any  = moment(item?.end).add(Number(item?.sla_horas_respuesto),'hours');


  const getPosition = (start: Date) => {
    const startUnix = moment(start).unix();

    const relativePosition =
      ((startUnix - startRelative) * 100) / relativeMaximum;
    return Math.round(
      relativePosition > 0 ? relativePosition - 1 : relativePosition 
    );
  };

  const getWidth = (start: Date, end: Date) => {
    const startUnix = moment(start).unix();
    const endUnix = moment(end).unix();
    const itemRelative = endUnix - startUnix;
    const relativeWidth = (itemRelative * 100) / relativeMaximum;
    return Math.round(relativeWidth) + 1.3;
  };
  
  return (
    <TimelineItemStyle>
      <Popover content={<DetailOrderCard popover={item?.popover} />} trigger="click" placement="bottom">
        <Tooltip title={item.title} color={item.highlight ? item.color : "#1C1C1C"} >
        <div
          className={`timeline-item ${item.highlight ? "item-highlight" : ""}`}
          style={{
            width: `${getWidth(item.start, item.end)}%`,
            left: `${getPosition(item.start)}%`,
          }}
        >
          <div className="timeline-box" style={
            item.highlight ? { backgroundColor: item.color, border: 'none' } : 
            {
              backgroundColor: "#1C1C1C",
            }}>
            <p className="item-title">{item.title}</p>
          </div>
        </div>
        </Tooltip>
      </Popover>
    </TimelineItemStyle>
  );
};

export default TimelineItems;
