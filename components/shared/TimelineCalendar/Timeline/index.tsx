import moment from "moment";
import { useEffect, useState } from "react";
import TimelineItems, { ITimelineItem } from "../TimelineItems";
import { TimelineStyle } from "./style";
import { getLogs } from "../../../../services/Dashboard";


interface ITimeline {
  // items: ITimelineItem[];
  order?: ITimelineItem[];
  ranges: {
    start: Date;
    end: Date;
  };
}

const Timeline = ({ ranges, order }: ITimeline) => {
  const [items, setItems] = useState<Array<ITimelineItem>>(order || []);
  const [relativeMaximum, setRelativeMaximum] = useState(0);
  const [startRelative, setStartRelative] = useState(0);

  useEffect(() => {
    if (ranges) {
      const start = moment(ranges.start).unix();
      const end = moment(ranges.end).unix();

      setRelativeMaximum(end - start);
      setStartRelative(start);
    }
  }, [ranges]);

  return (
    <TimelineStyle style={{ margin: "0px 7.5px" }}>
      <div className="timeline-calendar timeline">
        <div className="timeline-calendar line" />

        {items?.map((item, index) => (
          
          <TimelineItems
            relativeMaximum={relativeMaximum}
            startRelative={startRelative}
            item={item}
            key={index}
          />
        ))}
      </div>
    </TimelineStyle>
  );
};

export default Timeline;
