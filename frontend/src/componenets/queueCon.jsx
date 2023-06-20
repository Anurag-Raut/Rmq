import Countdown from "react-countdown";
function QueueCon({ queue }) {
  return (
    <div>
      {queue?.map((data, index) => {
        return (
          <div key={index} class="flex justify-between w-3">
            <h4 className="mr-3" key={index}>
              {data.orderId}
            </h4>
            <Countdown
              date={data.time-new Date().getTime()}
              intervalDelay={0}
              precision={1}
              renderer={(props) => <div>{props.total / 1000}</div>}
            />
          </div>
        );
      })}
    </div>
  );
}
export default QueueCon;
