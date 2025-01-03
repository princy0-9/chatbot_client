import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { fetchFormByIdApi } from "../apis/Form";
import Navbar from '../components/Navbar';
import styles from '../assets/Response.module.css';
import { PieChart, Pie, Cell, Tooltip, Label } from 'recharts';

function Response() {
    const token = useAuth();
    const [searchParams] = useSearchParams();

    const [formId, setFormId] = useState(searchParams.get('wid'));
    const [formStarts, setFormStarts] = useState(0);
    const [formCompletion, setFormCompletion] = useState(0);

    const [noResponse, setNoResponse] = useState(false);
    const [formData, setFormData] = useState({ formHits: 0, formSequence: [], formResponse: [] });

    const { formHits, formSequence, formResponse } = formData;
    const headers = formSequence.filter((data) => data.key.includes("user")).map(item => item.key);

    const completedPercentage = Math.round(
        (formCompletion / formHits) * 100,
    );

    const data = [
        { name: 'Completed', value: completedPercentage },
        { name: 'Remaining', value: 100 - completedPercentage },
    ];

    const COLORS = ['#4285f4', '#90a4ae'];


    const getFromStats = () => {
        let starts = 0, completes = 0;
        const seqLength = formSequence.filter(item => item.data.role === 'user').length;

        formResponse.forEach((item) => {
            const resLength = Object.keys(item).length;
            seqLength == resLength - 2 ? completes++ : starts++;
        })

        setFormStarts(starts);
        setFormCompletion(completes);
    };

    const fetchFormById = async () => {
        const data = await fetchFormByIdApi(formId, token);
        setFormData(data);
        if (data.formResponse.length == 0) setNoResponse(true);
    };

    useEffect(() => {
        if (token && formId) {
            fetchFormById();
        }
    }, [token, formId]);

    useEffect(() => {
        if (token && formId) {
            getFromStats();
        }
    }, [formSequence, formResponse]);

    return (
        <div className={styles.response}>
            <Navbar />
            {noResponse && <p className={styles.noResponse}>No response yet collected</p>}
            <section className={styles.content}>
                <div className={styles.brief}>
                    <div className={styles.card}>
                        <p>Views</p>
                        <p>{formHits}</p>
                    </div>
                    <div className={styles.card}>
                        <p>Starts</p>
                        <p>{formStarts}</p>
                    </div>
                </div>
                <div className={styles.tableContainer}>
                    {formResponse.length > 0 && (
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>First Interaction Time</th>
                                    {headers.map((key) => (
                                        <th key={key}>{key.split("-")[1].split(":").join(" ")}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {formResponse.map((valueRow, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{valueRow.startDate}</td>
                                        {headers.map((key) => (
                                            <td key={key}>{valueRow[key]}</td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                <div style={{ width: "500px", height: "500px", margin: "auto", display: 'flex' }}>

                    <PieChart width={400} height={200}>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <>
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    {entry.name === 'Completed' && (
                                        <Label
                                            value={`${entry.value}%`}
                                            position="outside"
                                            fill="#fff" /* White label color */
                                        />
                                    )}
                                </>
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                    <div className={styles.card2}>
                        <p>Completion rate</p>
                        <p>{formHits ? parseInt(formCompletion / formHits * 100) : 0} %</p>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Response;
