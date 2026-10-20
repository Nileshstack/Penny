import React, { useEffect, useState } from 'react'
import { Form, Input, Modal, Select, Table, DatePicker } from 'antd'
import Layout from '../components/Layout/Layout'
import { AreaChartOutlined, DeleteOutlined, EditOutlined, UnorderedListOutlined } from '@ant-design/icons'
import '../styles/HomePage.css'
import api from '../services/api'
import Spinner from '../components/Layout/Spinner'
import Analytics from '../components/Layout/Analytics'
import { toast } from 'react-toastify';

const { RangePicker } = DatePicker;

const HomePage = () => {
  const [ShowModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [alltransection, setAllTrnsection] = useState([])
  const [frequency, setFrequency] = useState('365')
  const [selectedDate, setSelectedDate] = useState([])
  const [type, setType] = useState('all')
  const [viewData, setViewdata]= useState('table')
  const [editTable, setEditTable] = useState(null)
  const [reload, setReload] = useState(0)

  // table columns
  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      render: (text) => new Date(text).toLocaleDateString()
    },
    {
      title: 'Amount',
      dataIndex: 'amount'
    },
     {
      title: 'Type',
      dataIndex: 'type'
    },
    {
      title: 'Category',
      dataIndex: 'category'
    },
    {
      title: 'Reference',
      dataIndex: 'reference'
    },
    {
      title: 'Description',
      dataIndex: 'description'
    },
     {
      title: 'Actions',
      render:(text,record)=>(
        <div>
          <EditOutlined onClick={()=>{
            setEditTable(record)
            setShowModal(true)
          }}/> 
          <DeleteOutlined className='mx-2' onClick={()=>{handleDelete(record);}}/>
        </div>
      )
    }
  ]

  // useEffect to fetch transactions
  useEffect(() => {
    const getAllTransection = async () => {
      try {
        setLoading(true)
        const res = await api.post('/v1/transections/get-transection', {
          frequency,
          selectedDate,
          type
        })
        setLoading(false)
        setAllTrnsection(res.data.data) 
      } catch (error) {
        setLoading(false)
        toast.warn('Something went wrong')
      }
    }

    getAllTransection()
  }, [frequency, selectedDate, type, reload])

  //delete Handler
  const handleDelete=async(record)=>{
    try {
      setLoading(true)
      await api.post('/v1/transections/delete-transection', { transactionId: record._id });
      setLoading(false)
      setAllTrnsection((transactions) => transactions.filter((transaction) => transaction._id !== record._id))
      toast.success('Transection Deleted')
    } catch (error) {
      setLoading(false)
       toast.warn('Unable to delete')
    }
  }

  // Form submit handler
  const handleSubmit = async (values) => {
    try {
      setLoading(true)
      if(editTable){
          await api.post('/v1/transections/edit-transection', {
         payload:{
           ...values
         },
         transactionId: editTable._id
      })
      setLoading(false)
      toast.success ('Transaction updated successfully')
      }else{
        await api.post('/v1/transections/add-transection', values)
      setLoading(false)
      toast.success('Transaction added successfully')
      }
      setShowModal(false);
      setEditTable(null);
      setReload((current) => current + 1)
    } catch (error) {
      setLoading(false)
      toast.warn('Unable to save transaction')
    }
  }

  return (
    <Layout>
      <div className="filters">
        {loading && <Spinner />}
        <div>
          <h5>Select Filter</h5>
          <Select value={frequency} onChange={(values) => setFrequency(values)}>
            <Select.Option value='7'>Last 1 Week</Select.Option>
            <Select.Option value='30'>Last 1 Month</Select.Option>
            <Select.Option value='365'>Last 1 Year</Select.Option>
            <Select.Option value='custom'>Custom</Select.Option>
          </Select>
          {frequency === 'custom' && (
            <RangePicker
              value={selectedDate}
              onChange={(values) => setSelectedDate(values)}
              format="YYYY-MM-DD"
            />
          )}
        </div>

        <div>
          <h5>Select Type</h5>
          <Select value={type} onChange={(values) => setType(values)}>
            <Select.Option value='all'>All</Select.Option>
            <Select.Option value='income'>INCOME</Select.Option>
            <Select.Option value='expense'>EXPENSE</Select.Option>
          </Select>
        </div>
    <div className='switch-icon'>
            <UnorderedListOutlined className={` mx-3 ${viewData==='table'?'active-icon':'inactive-icon'}`}onClick={()=> setViewdata('table')}/>
            <AreaChartOutlined className={` mx-3 ${viewData==='analytics'?'active-icon':'inactive-icon'}`} onClick={()=> setViewdata('analytics')}/>
          </div>
        <div>
          <button className='btn btn-primary' onClick={() => {
            setEditTable(null)
            setShowModal(true)
          }}>Add New</button>
        </div>
      </div>

      <div className="content">
        {viewData ==='table'?
          <Table
          columns={columns}
          dataSource={Array.isArray(alltransection) ? alltransection : []}
          rowKey={(record) => record._id || record.id}
        />: <Analytics alltransection={alltransection}/>
        }
        
      </div>

      <Modal
        title={editTable ? 'Edit Transection' : 'Add Transection'}
        open={ShowModal}
        footer={false}
        onCancel={() => {
          setShowModal(false)
          setEditTable(null)
        }}
      >
        <Form key={editTable?._id || 'new'} layout='vertical' onFinish={handleSubmit} initialValues={editTable ? {
          ...editTable,
          date: new Date(editTable.date).toISOString().slice(0, 10),
        } : undefined}>
          <Form.Item label='Amount' name='amount' rules={[{ required: true, message: 'Please enter an amount' }]}>
            <Input type='number' />
          </Form.Item>
          <Form.Item label='Type' name='type' rules={[{ required: true, message: 'Please select a type' }]}>
            <Select>
              <Select.Option value='income'>Income</Select.Option>
              <Select.Option value='expense'>Expense</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label='Category' name='category' rules={[{ required: true, message: 'Please select a category' }]}>
            <Select>
              <Select.Option value="salary">Salary</Select.Option>
              <Select.Option value="tip">Tip</Select.Option>
              <Select.Option value="project">Project Income</Select.Option>
              <Select.Option value="food">Food Expense</Select.Option>
              <Select.Option value="movie">Movie Expense</Select.Option>
              <Select.Option value="bills">Bills Expense</Select.Option>
              <Select.Option value="medical">Medical Expense</Select.Option>
              <Select.Option value="fees">Fees Expense</Select.Option>
              <Select.Option value="others">Other Expense</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label='Reference' name='reference'>
            <Input type='text' />
          </Form.Item>
          <Form.Item label='Description' name='description' rules={[{ required: true, message: 'Please enter a description' }]}>
            <Input type='text' />
          </Form.Item>
          <Form.Item label='Date' name='date' rules={[{ required: true, message: 'Please select a date' }]}>
            <Input type='date' />
          </Form.Item>
          <div className="d-flex justify-content-end">
            <button type='submit' className='btn btn-primary'>SAVE</button>
          </div>
        </Form>
      </Modal>
    </Layout>
   
  )
}

export default HomePage
