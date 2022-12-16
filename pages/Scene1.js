import CarModal from '../components/CarModal';
import { useState, useEffect } from 'react';
import { Space, InputNumber, Button } from 'antd';
import { fcfs_multiple, dp, dp2 } from '../util/algorithm';
import Lane from '../components/Lane'
import Merge from '../components/Merge';
import Car from '../components/Car';
import styled from 'styled-components';

const Scene1Wrapper = styled.div`
    text-align: center;
    position: relative;
`


export default function Scene1() {
    const [modalOpen, setModalOpen] = useState(false)
    const [laneNum, setLaneNum] = useState(2)
    const [cars, setCars] = useState([[], []])
    const [W_equal, setW_equal] = useState(1)
    const [W_plus, setW_plus] = useState(3)
    const [run, setRun] = useState(false)
    const [savedCars, setSavedCars] = useState([[], []])
    const [result, setResult] = useState(undefined)

    useEffect(() => {
        if (run) {
            let run = setInterval(() => {
                setCars(cars.map((carLine) => carLine.filter((car) => car > -25).map((car) => car - 1)))
            }, 500)
            return () => clearInterval(run)
        }
    })

    useEffect(() => {
        if (result !== undefined) {
            setSavedCars(cars)
            console.log("saved cars")
            console.log(cars)
        }
    }, [result])

    useEffect(() => {
        console.log(result)
        console.log(cars)
    }, [result])

    return (
        <Scene1Wrapper>
            <Space>
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
            </Space> <br />
            <Space>
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
                </Space>
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
                <Button
                    onClick={() => {
                        setResult(fcfs_multiple(W_equal, W_plus, cars, laneNum))
                    }}
                    disabled={(result !== undefined)}
                >Calculate Result</Button>
                <Button
                    onClick={() => {
                        // setSavedCars(cars)
                        setRun(true)
                        // console.log(cars)
                        // setCars(cars.map((carLine) => carLine.filter((car) => car > -25).map((car) => car - 1)))
                    }}
                    disabled={run || (result === undefined)}
                >Run</Button>
                <Button
                    type="primary"
                    onClick={() => {
                        setRun(false);
                    }}
                    disabled={!run}
                >Stop</Button>
                <Button
                    type="primary"
                    onClick={() => {
                        setRun(false)
                        setResult(undefined)
                        setCars(savedCars)
                    }}
                    disabled={run}
                >Reset</Button>
            </Space><br />
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
        </Scene1Wrapper>
    );
}

