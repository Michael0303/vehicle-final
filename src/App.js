import './App.css';
import CarModal from './components/CarModal';
import { Component, useState } from 'react';
import { Button } from 'antd';
import { fcfs, dp, dp2 } from './util/algorithm';
import Lane from './components/Lane'
import Merge from './components/Merge';

function App() {
    const [modalOpen, setModalOpen] = useState(false)
    const [laneNum, setLaneNum] = useState(2)
    const [cars, setCars] = useState([[], []])
    const [W_equal, setW_equal] = useState(1)
    const [W_plus, setW_plus] = useState(3)
    const [outCome, setOutCome] = useState(undefined)

    return (
        <div className="App">
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
            >Lane -</Button>
            <CarModal
                open={modalOpen}
                onCreate={({ number, time }) => {
                    setCars(cars.map((car_line, index) => {
                        if (index === number) {
                            car_line.push(time)
                        }
                        return car_line
                    }))
                    console.log(cars)
                    setModalOpen(false)
                }}
                onCancel={() => {
                    setModalOpen(false)
                }}
                laneNum={laneNum}
            />
            <Button onClick={() => {
                // setOutCome(fcfs(W_equal, W_plus, cars[0].length, cars[1].length, cars[0], cars[1]))
                console.log(cars)
            }} >Run</Button>
            <div>
                {"lane #: " + laneNum}<br />
                {[...Array(laneNum).keys()].map((index) => <Lane key={index} id={index} x={20} y={200 + 55 * index} width={980} height={50} cars={cars} setCars={setCars} idx={index} />)}
                <Merge x={1000} y={200} width={200} height={55 * laneNum} mergeHeight={50} />
                <Lane key={"out"} id={"out"} x={1200} y={170 + (55 * laneNum) / 2} width={500} height={50} idx={-1} />
                {outCome ? console.log(outCome) : "please input to calculate."}
            </div>
        </div>
    );
}

export default App;
