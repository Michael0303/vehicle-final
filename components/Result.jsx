import React from 'react';
import { Space, Table, Tag } from 'antd';
import styled from 'styled-components';


const columns = [
    {
        title: 'Number',
        dataIndex: 'number',
        key: 'number',
        render: (text) => <a>{text}</a>,
    },
    {
        title: 'Arriving Time',
        dataIndex: 'arrivingTime',
        key: 'arrivingTime',
        render: (text) => <a>{text}</a>,
    },
    {
        title: 'Entering Time',
        dataIndex: 'enteringTime',
        key: 'enteringTime',
        render: (text) => <a>{text}</a>,
    },
    {
        title: 'Status',
        key: 'Status',
        dataIndex: 'status',
        render: (time) => {
            let tag = "RUN"
            let color = "pink"
            if (time === 0) {
                tag = "WAIT"
                color = "red"
            }
            if (time < 0) {
                tag = "ENTER"
                color = "green"
            }
            return (
                <Tag color={color} key={time}>
                    {tag.toUpperCase()}
                </Tag>
            );

        }
    },
];

const Result = ({ laneIndex, enteringTime, arrivingTime, currentTime }) => {
    console.log(laneIndex)
    console.log(enteringTime)
    let lane = ["A", "B", "C", "D", "E"]
    let data = enteringTime.map((time, idx) => {
        let id = lane[laneIndex] + '-' + idx
        return {
            key: id,
            number: id,
            arrivingTime: arrivingTime[idx],
            enteringTime: enteringTime[idx],
            status: currentTime[idx],
        }
    })
    return (
        <Table columns={columns} dataSource={data} />
    )
}
export default Result;