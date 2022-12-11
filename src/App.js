import './App.css';
import CarModal from './components/CarModal';
import { useState } from 'react';
import { Button } from 'antd';

function App() {
    const [modalOpen, setModalOpen] = useState(false)
    const [laneNum, setLaneNum] = useState(2)
    const [cars, setCars] = useState([[], [], [], [], []])

    return (
        <div className="App">
            <Button onClick={() => setModalOpen(true)}>
                Add
            </Button>
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
            <div>
                {cars.toString()}
            </div>
        </div>
    );
}

export default App;
