import CarModal from '../components/CarModal';
import { useState, useEffect } from 'react';
import { Space, InputNumber, Button, Radio } from 'antd';
import { fcfs_multiple, dp, dp2, dp_multiple } from '../util/algorithm';
import Lane from '../components/Lane'
import Merge from '../components/Merge';
import Car from '../components/Car';
import styled from 'styled-components';
import Result from '../components/Result';

const Scene1Wrapper = styled.div`
    text-align: center;
    position: relative;
`
const TableWrapper = styled.div`
    position: absolute;
    width: auto
    background-color: black;
    top: 600px;
    display: flex;
    justify-content: center;
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
    const [time, setTime] = useState(0)
    const [choice, setChoice] = useState(0)

    let algorithm = [fcfs_multiple, dp_multiple]

    useEffect(() => {
        if (run) {
            let run = setInterval(() => {
                // setCars(cars.map((carLine) => carLine.filter((car) => car > -25).map((car) => car - 1)))
                setTime(time + 1)
            }, 500)
            return () => clearInterval(run)
        }
    })

    useEffect(() => {
        // setCars(cars.map((carLine) => carLine.filter((car) => car > -25).map((car) => car - 1)))
        if (time > 0) {
            setCars(cars.map((carLine, idx) => carLine.map((car, idy) => {
                let enteringTime = result.entering_time[idx][idy]
                if (car !== 0 || time >= enteringTime) {
                    return car - 1
                } else {
                    return car
                }
            })))
        }
    }, [time])

    useEffect(() => {
        if (result !== undefined) {
            setSavedCars(cars)
            // console.log("saved cars")
            // console.log(cars)
            // console.log(result.entering_time[0])
        }
    }, [result])

    useEffect(() => {
        console.log(result)
        // console.log(cars)
    }, [result])

    return (
        <Scene1Wrapper>
            <Space>
                <Button onClick={() => setModalOpen(true)} disabled={result !== undefined}>
                    Add
                </Button>
                <Button
                    onClick={() => {
                        setLaneNum((n) => n + 1)
                        setCars([...cars, []])
                    }}
                    disabled={laneNum === 5 || result !== undefined}
                >Lane +</Button>
                <Button
                    onClick={() => {
                        setLaneNum((n) => n - 1)
                        setCars(cars.slice(0, cars.length - 1))
                    }}
                    disabled={laneNum === 2 || result !== undefined}
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
                            car_line.sort()
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
            <Radio.Group onChange={(e) => setChoice(e.target.value)} value={choice}>
                <Radio value={0}>FCFS</Radio>
                <Radio value={1}>DP</Radio>
            </Radio.Group><br />
            <Space>
                <Button
                    onClick={() => {
                        setResult(algorithm[choice](W_equal, W_plus, cars, laneNum))
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
                        setTime(0)
                        setCars(savedCars)
                    }}
                    disabled={run}
                >Reset</Button>
            </Space><br />
            <h3>Current Time is {time}</h3>
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
            {(result === undefined) ? null :
                <TableWrapper>
                    {[...Array(laneNum).keys()].map((idx) => {
                        return <Result laneIndex={idx} enteringTime={result.entering_time[idx]} currentTime={cars[idx]} />
                    })}
                </TableWrapper>
            }

        </Scene1Wrapper>
    );
}

