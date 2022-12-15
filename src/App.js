import './App.css';
import CarModal from './components/CarModal';
import { useState, useEffect } from 'react';
import { Space, InputNumber, Button } from 'antd';
import { fcfs, dp, dp2 } from './util/algorithm';
import Lane from './components/Lane'
import Merge from './components/Merge';
import Car from './components/Car';

function App() {
    const [modalOpen, setModalOpen] = useState(false)
    const [laneNum, setLaneNum] = useState(2)
    const [cars, setCars] = useState([[], []])
    const [W_equal, setW_equal] = useState(1)
    const [W_plus, setW_plus] = useState(3)
    const [run, setRun] = useState(false)

    // setInterval(() => {
    //     setCars(cars.map((carLine) => carLine.filter((car) => car > -25).map((car) => car - 1)))
    // }, 1000)
    useEffect(() => {
        if (run) {
            let run = setInterval(() => {
                setCars(cars.map((carLine) => carLine.filter((car) => car > -25).map((car) => car - 1)))
            }, 500)
            return () => clearInterval(run)
        }
    })


    return (
        <div className="App" >
            <Button onClick={() => setModalOpen(true)}>
                Add
            </Button>
            <Button
                onClick={() => {
                    setLaneNum((n) => n + 1)
                    setCars([...cars, []])
                }}
                disabled={laneNum === 5}
            >Lane +</Button>
            <Button
                onClick={() => {
                    setLaneNum((n) => n - 1)
                    setCars(cars.slice(0, cars.length - 1))
                }}
                disabled={laneNum === 2}
            >Lane -</Button><br />
            <Space>
                Wequal
                <InputNumber min={1} value={W_equal} onChange={setW_equal} />
                <Button
                    type="primary"
                    onClick={() => {
                        setW_equal(1);
                    }}
                >
                    Reset
                </Button>
            </Space><br />
            <Space>
                Wplus
                <InputNumber min={3} value={W_plus} onChange={setW_plus} />
                <Button
                    type="primary"
                    onClick={() => {
                        setW_plus(3);
                    }}
                >
                    Reset
                </Button>
            </Space><br />
            <CarModal
                open={modalOpen}
                onCreate={({ number, time }) => {
                    setCars(cars.map((car_line, index) => {
                        if (index === number) {
                            car_line.push(time)
                        }
                        return car_line
                    }))
                    // console.log(cars)
                    setModalOpen(false)
                }}
                onCancel={() => {
                    setModalOpen(false)
                }}
                laneNum={laneNum}
            /><br />
            <Space>
                <Button onClick={() => {
                    setRun(true)
                    // console.log(cars)
                    // setCars(cars.map((carLine) => carLine.filter((car) => car > -25).map((car) => car - 1)))
                }} >Run</Button>
                <Button
                    type="primary"
                    onClick={() => {
                        setRun(false);
                    }}
                >
                    Stop
                </Button>
            </Space><br />
            <br />{"lane #: " + laneNum}<br />
            <div style={{ position: 'absolute', textAlign: 'center' }}>
                {[...Array(laneNum).keys()].map((index) => <Lane key={index} id={index} x={0} y={200 + 50 * index} width={1000} height={50} cars={cars} setCars={setCars} laneNum={laneNum} idx={index} />)}
                <Merge x={1000} y={200 + 50 * (laneNum - 1) / 2} width={200} height={50 * laneNum} mergeHeight={50} />
                <Lane key={"out"} id={"out"} x={1200} y={200 + 50 * (laneNum - 1) / 2} width={500} height={50} laneNum={laneNum} idx={-1} />
                {cars.map((carLine, idx) =>
                    carLine.map((time, index) => {
                        if (time > 0) return <Car key={"Car" + idx + '-' + index} id={"Car" + idx + '-' + index} x={1000 - 20 * time} y={200 + 50 * idx} color={"pink"} />
                        if (time === 0) return <Car key={"Car" + idx + '-' + index} id={"Car" + idx + '-' + index} x={1000} y={200 + 50 * idx} color={"blue"} />
                        if (time < 0) return <Car key={"Car" + idx + '-' + index} id={"Car" + idx + '-' + index} x={1200 - 20 * time} color={"green"} enter={true} y={200 + 50 * (laneNum - 1) / 2} />
                    }))}
            </div>
        </div>
    );
}

export default App;
