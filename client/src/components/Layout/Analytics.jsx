import React from 'react'
import { Progress } from 'antd'
import { motion } from 'framer-motion'
import '../../styles/Analytics.css';

const Analytics = ({ alltransection }) => {
  const catagories = ['salary', 'tip', 'project', 'food', 'movie', 'bills', 'medical', 'fees', 'others'];

  const totalTransaction = alltransection.length;
  const totalIncomeTransection = alltransection.filter(t => t.type === 'income');
  const totalExpenseTransection = alltransection.filter(t => t.type === 'expense');
  const totalIncomePercent = totalTransaction ? (totalIncomeTransection.length / totalTransaction) * 100 : 0;
  const totalExpensePercent = totalTransaction ? (totalExpenseTransection.length / totalTransaction) * 100 : 0;

  const totalTurnover = alltransection.reduce((acc, t) => acc + Number(t.amount || 0), 0);
  const totalIncomeTurnover = totalIncomeTransection.reduce((acc, t) => acc + Number(t.amount || 0), 0);
  const totalExpenseTurnover = totalExpenseTransection.reduce((acc, t) => acc + Number(t.amount || 0), 0);

  const totalIncomeTurnoverPercent = totalTurnover ? (totalIncomeTurnover / totalTurnover) * 100 : 0;
  const totalExpenseTurnoverPercent = totalTurnover ? (totalExpenseTurnover / totalTurnover) * 100 : 0;

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: i => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.2, duration: 0.5, type: 'spring', stiffness: 60 }
    })
  };

  return (
    <>
      <div className="row mt-3">
        {[...Array(2)].map((_, i) => (
          <div className="col-md-4" key={i}>
            <motion.div
              custom={i}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
            >
              {i === 0 ? (
                <div className="card">
                  <div className="card-header">total Transaction : {totalTransaction}</div>
                  <div className="card-body">
                    <h5 className='text-success'>Income : {totalIncomeTransection.length}</h5>
                    <h5 className='text-danger'>Expanse : {totalExpenseTransection.length}</h5>
                  </div>
                  <div>
                    <Progress type="circle" strokeColor={'green'} className='mx-2' percent={Math.round(totalIncomePercent)} />
                    <Progress type="circle" strokeColor={'red'} className='mx-2' percent={Math.round(totalExpensePercent)} />
                  </div>
                </div>
              ) : (
                <div className="card">
                  <div className="card-header">total Turnover : {totalTurnover}</div>
                  <div className="card-body">
                    <h5 className='text-success'>Income : {totalIncomeTurnover}</h5>
                    <h5 className='text-danger'>Expense : {totalExpenseTurnover}</h5>
                  </div>
                  <div>
                    <Progress type="circle" strokeColor={'green'} className='mx-2' percent={Math.round(totalIncomeTurnoverPercent)} />
                    <Progress type="circle" strokeColor={'red'} className='mx-2' percent={Math.round(totalExpenseTurnoverPercent)} />
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        ))}
      </div>

      <div className="row mt-3">
        <div className="col-md-4">
          <h4>Catagorywise Income</h4>
          {
            catagories.map((category, index) => {
              const amount = alltransection.filter(t => t.type === 'income' && t.category === category)
                .reduce((acc, t) => acc + t.amount, 0);
              return (
                amount > 0 &&
                <motion.div
                  key={category}
                  variants={cardVariants}
                  custom={index}
                  initial="hidden"
                  animate="visible"
                >
                  <div className="card">
                    <div className="card-body">
                      <h5>{category}</h5>
                      <Progress percent={Math.round((amount / totalIncomeTurnover) * 100)} strokeColor={'green'} />
                    </div>
                  </div>
                </motion.div>
              )
            })
          }
        </div>

        <div className="col-md-4">
          <h4>Catagorywise Expense</h4>
          {
            catagories.map((category, index) => {
              const amount = alltransection.filter(t => t.type === 'expense' && t.category === category)
                .reduce((acc, t) => acc + t.amount, 0);
              return (
                amount > 0 &&
                <motion.div
                  key={category}
                  variants={cardVariants}
                  custom={index}
                  initial="hidden"
                  animate="visible"
                >
                  <div className="card">
                    <div className="card-body">
                      <h5>{category}</h5>
                      <Progress percent={Math.round((amount / totalExpenseTurnover) * 100)}  strokeColor={'red'}/>
                    </div>
                  </div>
                </motion.div>
              )
            })
          }
        </div>
      </div>
    </>
  )
}

export default Analytics
