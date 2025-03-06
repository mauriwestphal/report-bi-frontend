import "moment/locale/es";
import moment, { Moment } from "moment";

import { groupBy } from "lodash";
import { RelativeTimeHeaderStyle } from "./style";
import {
  TIME_CALENDAR_TYPE,
  TIME_CALENDAR_TYPE_FORMAT,
} from "../../../../shared/enum/time-calendar-type.enum";

moment.locale("es");

interface IRelativeTime {
  type: TIME_CALENDAR_TYPE;
  ranges: {
    start: Date | EpochTimeStamp;
    end?: Date | EpochTimeStamp;
  };
}

const getFormatTimes = (type: TIME_CALENDAR_TYPE) => {
  switch (type) {
    case TIME_CALENDAR_TYPE.HOURS:
      return TIME_CALENDAR_TYPE_FORMAT.HOURS;
    case TIME_CALENDAR_TYPE.MONTHS:
      return TIME_CALENDAR_TYPE_FORMAT.MONTHS;
    case TIME_CALENDAR_TYPE.WEEKS:
      return TIME_CALENDAR_TYPE_FORMAT.WEEKS;
    default:
      return "";
  }
};
const getFormatGroup = (type: TIME_CALENDAR_TYPE, dateInstance: Moment) => {
  switch (type) {
    case TIME_CALENDAR_TYPE.HOURS:
      return `${dateInstance.format(`MMMM`)} ${dateInstance.format("DD")}`;
    case TIME_CALENDAR_TYPE.MONTHS:
      return dateInstance.format(`MMMM`);
    case TIME_CALENDAR_TYPE.WEEKS:
      return dateInstance.format(`MMMM`);
    default:
      return "";
  }
};

const getDiffTime = (
  type: TIME_CALENDAR_TYPE
): moment.unitOfTime.DurationConstructor | undefined => {
  switch (type) {
    case TIME_CALENDAR_TYPE.HOURS:
      return TIME_CALENDAR_TYPE.HOURS;
    case TIME_CALENDAR_TYPE.MONTHS:
      return TIME_CALENDAR_TYPE.WEEKS;
    case TIME_CALENDAR_TYPE.WEEKS:
      return "days";
    default:
      return undefined;
  }
};

const RelativeTime = ({ type, ranges }: IRelativeTime) => {
  const getHours = () => {
    const dateElements = [];
    const formatedDateElements = [];
    const concatedDates = [];
    const start = moment(ranges.start);
    const end = moment(ranges.end);

    const range = end.diff(start, getDiffTime(type));

    for (let i = 0; i < range + 1; i++) {
      const dateElement = moment(start).add(i, getDiffTime(type));
      dateElements.push(dateElement);
    }

    const relativeWidth = dateElements.length;

    const groupedDates = groupBy(dateElements, (dateElement) =>
      getFormatGroup(type, dateElement)
    );

    for (let element in groupedDates) {
      const dates = groupedDates[element];

      formatedDateElements.push({
        groupName: element,
        dateRanges: dates.map((date) => date.format(getFormatTimes(type))),
        width: (dates.length * 100) / relativeWidth,
      });
      concatedDates.push(
        ...dates.map((date) => date.format(getFormatTimes(type)))
      );
    }

    return { formatedDateElements, concatedDates };
  };

  return (
    <RelativeTimeHeaderStyle>
      <div className="timeline-calendar relative-time-header">
        <div className="group-name">
          {getHours().formatedDateElements.map((element, index) => (
            <div
              style={{ width: `${element.width}%` }}
              className="relative-time-header date-group"
              key={index}
            >
              <div className="relative-time-header date-group-name">
                {element.groupName}
              </div>
            </div>
          ))}
        </div>
        <div className="group-values">
          {
            // validar si el tipo de calendario es hora, si es hora se pinta el circulo de color naranja en la hora actual
            getHours().concatedDates.map((element, index) => {
              if (element === moment().format(getFormatTimes(type)) && type === TIME_CALENDAR_TYPE.WEEKS) {
                return (
                  <div className="items" key={index}>

                    <div
                      className="circle"
                      style={{
                        backgroundColor: '#FF6600',
                        borderRadius: '50%',
                        width: '25px',
                        height: '25px',
                        position: 'relative',
                        textAlign: 'center',
                      }}
                    >
                      <div
                        style={{
                          position: 'absolute',
                          top: '0',
                          left: '50%',
                          transform: 'translateX(-100%)',
                          width: '2px',
                          height: '200vh',
                          backgroundColor: '#FF6600',
                          zIndex: 9999,
                        }}
                      />

                      {element}


                    </div>
                  </div>
                )
                // hacer que el else if valide el elemnt con la hora actual sin minutos ni segundos
              } else if (element.toString() === (moment().format('H') + ':00').toString() && type === TIME_CALENDAR_TYPE.HOURS) {
                return (<div className="items" key={index}>
                  <div
                    className="circle"
                    style={{
                      display: 'flex',
                      backgroundColor: '#FF6600',
                      borderRadius: '50%',
                      width: '100%',
                      height: '35px',
                      position: 'relative',
                      textAlign: 'center',
                      justifyContent: 'center',
                      alignItems: 'center',
                      top: '-10px',
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        top: '0',
                        left: '50%',
                        transform: 'translateX(-100%)',
                        width: '2px',
                        height: '200vh',
                        backgroundColor: '#FF6600',
                        zIndex: 9999,
                      }}
                    />
                    {element}
                  </div>
                </div>)
              } else {
                return (
                  <div className="items" key={index}>
                    {element}
                  </div>
                )
              }


            })}
        </div>
      </div>
    </RelativeTimeHeaderStyle>
  );
};

export default RelativeTime;
