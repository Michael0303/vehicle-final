import React from 'react'
import { Modal, Form, InputNumber } from 'antd'

export default function CarModalPerLine({ open, onCreate, onCancel, index }) {
    const [form] = Form.useForm()
    return (
        <Modal
            open={open}
            title={`Add a new car to Lane-${index}`}
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
