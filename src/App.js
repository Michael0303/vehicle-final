import './App.css';
import CarModal from './components/CarModal';
import { Component, useState } from 'react';
import { Button } from 'antd';
import { fcfs, dp, dp2 } from './util/algorithm';

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
                setOutCome(fcfs(W_equal, W_plus, cars[0].length, cars[1].length, cars[0], cars[1]))
            }} >Run</Button>
            <div>
                {"lane #: " + laneNum}<br />
                {/* {() =>
                    <Component>
                        {cars.map((car_line) => <div>{car_line.toString()}</div>)}
                    </Component>
                } */}
                {outCome ? console.log(outCome) : "please input to calculate."}
            </div>
        </div>
    );
}

export default App;
