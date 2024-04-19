import React from "react";
import useTimer from "./useTimer";

type Props = {
  className: string;
  startDate: Date | string;
  endDate: Date | string;
};

const ProTime = (props: Props) => {
  const { days, hours, minutes, seconds } = useTimer(
    props.startDate,
    props.endDate
  );

  if (days !== "00")
    return (
      <p className={props.className}>
        <span id="days">{days} days</span>
        <span id="hour">{hours} hours</span>
        <span id="min">{minutes} min</span>
        <span id="sec">{seconds} sec</span>
      </p>
    );
  return (
    <p className={props.className}>
      <span id="hour">{hours}</span>
      <span className="column timer__item">:</span>
      <span id="min">{minutes}</span>

      <span className="column timer__item">:</span>
      <span id="sec">{seconds}</span>
    </p>
  );
};

export default ProTime;
