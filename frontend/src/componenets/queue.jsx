
function Queue({queue}){

    return(

        <div>
        {queue?.map((data, index) => {
          return <h4 key={index}>{data}</h4>;
        })}
      </div>

    )




}
export default Queue;