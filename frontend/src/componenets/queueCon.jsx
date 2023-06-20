import Countdown from "react-countdown";
function QueueCon({ queue }) {
  return (
    <div>
      {queue?.forEach((data, index) => {
        var tim=data.time- new Date().getTime();
        console.log(data.time- new Date().getTime())
        return (
          <div  class="flex justify-between w-3">
            <h4 className="mr-3" >
              {data.orderId}
            </h4>
            <Countdown
              date={Date.now()+ tim}
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
