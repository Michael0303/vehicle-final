import React from 'react'
import { Modal, Form, Input, InputNumber } from 'antd'

export default function CarModal({ open, onCreate, onCancel, laneNum}) {
    const [form] = Form.useForm()
    return (
        <Modal
            open={open}
            title="Add a new car"
            okText="Add"
            cancelText="Cancel"
            onCancel={onCancel}
            onOk={() => {
                form
                    .validateFields()
                    .then((values) => {
                        form.resetFields()
                        console.log(values)
                        onCreate(values)
                    })
                    .catch((e) => {
                        window.alert(e)
                    })
            }}
        >
            <Form form={form} layout="vertical" name="form_in_modal">
                <Form.Item
                    name="number"
                    label="Car's lane number(0~4)"
                    rules={[
                        {
                            required: true,
                            message: 'Error: Please enter the lane number of the car!'
                        }
                    ]}
                >
                    <InputNumber min={0} max={laneNum - 1}/>
                </Form.Item>
                <Form.Item
                    name="time"
                    label="Car's arrive time"
                    rules={[
                        {
                            required: true,
                            message: 'Error: Please enter the arrive time of the car!'
                        }
                    ]}
                >
                    <InputNumber min={0} />
                </Form.Item>
            </Form>
        </Modal>
    )
}
