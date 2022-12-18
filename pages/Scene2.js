import { useState, useEffect } from 'react';
import { Space, InputNumber, Button, Radio } from 'antd';
import { dp2 } from '../util/algorithm';
import Lane from '../components/Lane'
import Merge from '../components/Merge';
import Car from '../components/Car';
import styled from 'styled-components';
import Result from '../components/Result';

const Scene1Wrapper = styled.div`
    text-align: center;
    position: relative;
`
const TableWrapper1 = styled.div`
    position: absolute;
    width: auto
    background-color: black;
    top: 600px;
    display: flex;
    justify-content: center;
`
const TableWrapper2 = styled.div`
    position: absolute;
    width: auto
    background-color: black;
    top: 700px;
    display: flex;
    justify-content: center;
`

export default function Scene1() {
    const [modalOpen, setModalOpen] = useState(false)
    const [cars, setCars] = useState([[], [], []])
    const [W_equal1, setW_equal1] = useState(1)
    const [W_plus1, setW_plus1] = useState(3)
    const [W_equal2, setW_equal2] = useState(1)
    const [W_plus2, setW_plus2] = useState(3)
    const [transferTime, setTransferTime] = useState(10)
    const [run, setRun] = useState(false)
    const [savedCars, setSavedCars] = useState([[], [], []])
    const [result, setResult] = useState(undefined)
    const [time, setTime] = useState(0)
    const [choice, setChoice] = useState(0)
    const laneNum = 3

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
        if (time > 0) {
            setCars(cars.map((carLine, idx) => carLine.map((car, idy) => {
                switch (idx) {
                    case 0:
                    case 1: {
                        let entering_time1 = result.entering_time1[idx][idy]
                        let entering_time2 = result.entering_time2[idx][idy]
                        if ((car > 0) || (time >= entering_time1 && time < entering_time1 + transferTime) || (time >= entering_time2)) {
                            return car - 1
                        } else {
                            return car
                        }
                        break
                    }
                    case 2: {
                        let entering_time2 = result.entering_time2[idx][idy]
                        if ((car > 0) || (time >= entering_time2)) {
                            return car - 1
                        } else {
                            return car
                        }
                        break
                    }
                    default:
                        console.log("something went wrong")
                }
            })))
            // setCars(cars.map((carLine, idx) => carLine.map((car, idy) => car - 1)))
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
                Wequal1
                <InputNumber min={1} value={W_equal1} onChange={setW_equal1} />
                <Button
                    type="primary"
                    onClick={() => {
                        setW_equal1(1);
                    }}
                >
                    Reset
                </Button>
                Wplus1
                <InputNumber min={3} value={W_plus1} onChange={setW_plus1} />
                <Button
                    type="primary"
                    onClick={() => {
                        setW_plus1(3);
                    }}
                >
                    Reset
                </Button>
            </Space><br />
            <Space>
                Wequal2
                <InputNumber min={1} value={W_equal2} onChange={setW_equal2} />
                <Button
                    type="primary"
                    onClick={() => {
                        setW_equal2(1);
                    }}
                >
                    Reset
                </Button>
                Wplus2
                <InputNumber min={3} value={W_plus2} onChange={setW_plus2} />
                <Button
                    type="primary"
                    onClick={() => {
                        setW_plus2(3);
                    }}
                >
                    Reset
                </Button>
            </Space><br />
            <Space>
                Transfer Time
                <InputNumber min={1} value={transferTime} onChange={setTransferTime} />
                <Button
                    type="primary"
                    onClick={() => {
                        setTransferTime(10);
                    }}
                >
                    Reset
                </Button>
            </Space><br />
            <Space>
                <Button
                    onClick={() => {
                        console.log("start calculate")
                        console.log(cars)
                        setResult(dp2(W_equal1, W_plus1, W_equal2, W_plus2, transferTime, cars[0], cars[1], cars[2]))
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
                <Lane key={"lane-1"} id={"lane-1"} x={0} y={200} width={500} height={50} cars={cars} setCars={setCars} laneNum={laneNum} idx={0} />
                <Lane key={"lane-2"} id={"lane-2"} x={0} y={250} width={500} height={50} cars={cars} setCars={setCars} laneNum={laneNum} idx={1} />
                <Merge key={"merge-1"} id={"merge-1"} x={500} y={225} width={100} height={50 * 2} mergeHeight={50} />
                <Lane key={"lane-out1"} id={"lane-out1"} x={600} y={225} width={200} height={50} cars={cars} setCars={setCars} laneNum={laneNum} idx={-1} />
                <Lane key={"lane-3"} id={"lane-3"} x={0} y={325} width={800} height={50} cars={cars} setCars={setCars} laneNum={laneNum} idx={2} />
                <Merge key={"merge-2"} id={"merge-2"} x={800} y={275} width={200} height={150} mergeHeight={50} />
                <Lane key={"lane-out2"} id={"lane-out2"} x={1000} y={275} width={500} height={50} cars={cars} setCars={setCars} laneNum={laneNum} idx={-2} />

                {cars[0].map((time, index) => {
                    let idx = 0
                    if (time > 0) return <Car key={"Car" + idx + '-' + index} id={"Car" + idx + '-' + index} x={500 - 20 * time} y={200} color={"pink"} />
                    if (time === 0) return <Car key={"Car" + idx + '-' + index} id={"Car" + idx + '-' + index} x={500} y={200} color={"red"} />
                    if (time < 0 && time > -transferTime) return <Car key={"Car" + idx + '-' + index} id={"Car" + idx + '-' + index} x={600 - 200 * time / transferTime} color={"green"} enter={true} y={225} />
                    if (time < 0 && time === -transferTime) return <Car key={"Car" + idx + '-' + index} id={"Car" + idx + '-' + index} x={800} color={"red"} enter={false} y={225} />
                    if (time < 0 && time < -transferTime) return <Car key={"Car" + idx + '-' + index} id={"Car" + idx + '-' + index} x={1000 - 20 * (time + transferTime)} color={"green"} enter={true} y={275} />
                })}
                {cars[1].map((time, index) => {
                    let idx = 1
                    if (time > 0) return <Car key={"Car" + idx + '-' + index} id={"Car" + idx + '-' + index} x={500 - 20 * time} y={250} color={"pink"} />
                    if (time === 0) return <Car key={"Car" + idx + '-' + index} id={"Car" + idx + '-' + index} x={500} y={250} color={"red"} />
                    if (time < 0 && time > -transferTime) return <Car key={"Car" + idx + '-' + index} id={"Car" + idx + '-' + index} x={600 - 200 * time / transferTime} color={"green"} enter={true} y={225} />
                    if (time < 0 && time === -transferTime) return <Car key={"Car" + idx + '-' + index} id={"Car" + idx + '-' + index} x={800} color={"red"} enter={false} y={225} />
                    if (time < 0 && time < -transferTime) return <Car key={"Car" + idx + '-' + index} id={"Car" + idx + '-' + index} x={1000 - 20 * (time + transferTime)} color={"green"} enter={true} y={275} />
                })}
                {cars[2].map((time, index) => {
                    let idx = 2
                    if (time > 0) return <Car key={"Car" + idx + '-' + index} id={"Car" + idx + '-' + index} x={800 - 20 * time} y={325} color={"pink"} />
                    if (time === 0) return <Car key={"Car" + idx + '-' + index} id={"Car" + idx + '-' + index} x={800} y={325} color={"red"} />
                    if (time < 0) return <Car key={"Car" + idx + '-' + index} id={"Car" + idx + '-' + index} x={1000 - 20 * time} color={"green"} enter={true} y={275} />
                })}
            </div>
            {(result === undefined) ? null :
                <>
                    <TableWrapper1>
                        Merging Point 1
                        {[...Array(2).keys()].map((idx) => {
                            return <Result laneIndex={idx} enteringTime={result.entering_time1[idx]} arrivingTime={savedCars[idx]} currentTime={cars[idx]} />
                        })}
                    </TableWrapper1>
                    <TableWrapper2>
                        Merging Point 2
                        {[...Array(3).keys()].map((idx) => {
                            return <Result laneIndex={idx} enteringTime={result.entering_time2[idx]} arrivingTime={savedCars[idx]} currentTime={cars[idx]} />
                        })}
                    </TableWrapper2>
                </>
            }

        </Scene1Wrapper>
    );
}

