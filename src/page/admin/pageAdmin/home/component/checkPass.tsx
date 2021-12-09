import React, { useState, useEffect, useRef, useReducer } from 'react'
import songApi from '../../../../../api/songApi'
import playlistApi from '../../../../../api/playlistApi'
import userApi from '../../../../../api/useApi'
import BlogApi from '../../../../../api/BlogApi'
import artistApi from '../../../../../api/ArtistApi'
import { Formik, Form, Field } from 'formik';
interface CheckPass<T> {

}

const initialValue = {
    idp: []
}

const CheckPass: React.FC<CheckPass<any>> = () => {
    const [user, setUser] = useState<any[]>([]);
    const [passplaylist, setPassplaylist] = useState<any[]>([])
    const [passsong, setPasssong] = useState<any[]>([])
    const [passblog, setPassblog] = useState<any[]>([])
    const [passartist, setPassartist] = useState<any[]>([])

    const getSong = async () => {
        const { data } = await songApi.getAll({});
        const newData = data?.filter((item: any) => item?.passed == false)
        if (!newData) return
        setPasssong(newData)
    }

    const getPlaylist = async () => {
        const { data } = await playlistApi.getAll({});
        const newData = data?.filter((item: any) => item?.passed == false)
        setPassplaylist(newData);
    }

    const getUser = async () => {
        const { data } = await userApi.getAll({});
        const newData = data?.filter((item: any) => item?.passed == false)
        if (!newData) return
        setUser(newData)
    }

    const getBlog = async () => {
        const { data } = await BlogApi.getAll({});
        const newData = data?.filter((item: any) => item?.passed == false)
        if (!newData) return
        setPassblog(newData)
    }
    const getArtist = async () => {
        const { data } = await artistApi.getAll({});
        const newData = data?.filter((item: any) => item?.passed == false)
        if (!newData) return
        setPassartist(newData)
    }
    useEffect(() => {
        getPlaylist();
        getSong();
        getUser();
        getBlog();
        getArtist();
    }, []);

    const refForm = useRef<HTMLFormElement | any>(null);
    const onSubmit1 = (value: any) => {
        value.idp.map(async (item: any) => {
            const { data } = await artistApi.checkPass(item);
        })
        setTimeout(() => { }, 700)

    }
    const onSubmit2 = (value: any) => {
        value.idp.map(async (item: any) => {
            const { data } = await songApi.checkPass(item);
        })
        setTimeout(() => { }, 700)

    }
    const onSubmit3 = (value: any) => {
        value.idp.map(async (item: any) => {
            const { data } = await playlistApi.checkPass(item);
        })
    }
    const onSubmit4 = (value: any) => {
        value.idp.map(async (item: any) => {
            const { data } = await userApi.checkPass(item);
        })
        setTimeout(() => { }, 700)

    }
    const onSubmit5 = (value: any) => {
        value.idp.map(async (item: any) => {
            const { data } = await BlogApi.checkPass(item);
        })
        setTimeout(() => { }, 700)

    }
    return (
        <>
            <div className="main4">
                <div className="main4-all-in ">
                    <div>
                        <h5 className="text-light">Tất cả &gt;</h5>
                    </div>
                </div>
                <div className="_tab">
                    <input hidden type="checkbox" id="chck14" />
                    <label className="_tab-label" htmlFor="chck14">
                        <div className="_grid_item">
                            <label className="_button_text">Nhạc sĩ</label>
                            <div style={{ display: "flex", gridGap: "2rem" }}>
                                <div className="_icon_drop">&#10095;</div>
                                <input className="checkbox_name" type="checkbox" />
                            </div>

                        </div>

                    </label>

                    <div className="_tab-content">
                        <Formik onSubmit={onSubmit1} initialValues={initialValue}>
                            <Form ref={refForm}>
                                {passartist.map((item: any) => {
                                    return (
                                        <div className="content_flex">
                                            <div>{item.name}</div> <Field className="checkbox_name" name="idp" type="checkbox" value={item._id} />
                                        </div>
                                    )
                                })}
                                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "1rem" }}>
                                    <button className="btn" type='submit' style={{
                                        background: "#37AFBF",
                                        padding: "0.4rem 1rem 0.4rem 1rem",
                                        borderRadius: "0.2rem",
                                        border: "none",
                                        color: "#fff"
                                    }}>Check Pass</button>
                                </div>
                            </Form>
                        </Formik>
                    </div>
                </div>
                <div className="_tab">
                    <input hidden type="checkbox" id="chck16" />
                    <label className="_tab-label" htmlFor="chck16">
                        <div className="_grid_item">
                            <label className="_button_text">Music</label>
                            <div style={{ display: "flex", gridGap: "2rem" }}>
                                <div className="_icon_drop">&#10095;</div>
                                <input className="checkbox_name" type="checkbox" />
                            </div>

                        </div>

                    </label>

                    <div className="_tab-content">
                        <Formik onSubmit={onSubmit2} initialValues={initialValue}>
                            <Form ref={refForm}>
                                {passsong.map((item: any) => {
                                    return (
                                        <div className="content_flex">
                                            <div>{item.title}</div> <Field className="checkbox_name" name="idp" type="checkbox" value={item._id} />
                                        </div>
                                    )
                                })}
                                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "1rem" }}>
                                    <button className="btn" type='submit' style={{
                                        background: "#37AFBF",
                                        padding: "0.4rem 1rem 0.4rem 1rem",
                                        borderRadius: "0.2rem",
                                        border: "none",
                                        color: "#fff"
                                    }}>Check Pass</button>
                                </div>
                            </Form>
                        </Formik>
                    </div>
                </div>
                <div className="_tab">
                    <input hidden type="checkbox" id="chck17" />
                    <label className="_tab-label" htmlFor="chck17">
                        <div className="_grid_item">
                            <label className="_button_text">Playlist</label>
                            <div style={{ display: "flex", gridGap: "2rem" }}>
                                <div className="_icon_drop">&#10095;</div>
                                <input className="checkbox_name" type="checkbox" />
                            </div>

                        </div>

                    </label>

                    <div className="_tab-content">
                        <Formik onSubmit={onSubmit3} initialValues={initialValue}>
                            <Form ref={refForm}>
                                {passplaylist.map((item: any) => {
                                    return (
                                        <div className="content_flex">
                                            <div>{item.name}</div> <Field className="checkbox_name" name="idp" type="checkbox" value={item._id} />
                                        </div>
                                    )
                                })}
                                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "1rem" }}>
                                    <button className="btn" type='submit' style={{
                                        background: "#37AFBF",
                                        padding: "0.4rem 1rem 0.4rem 1rem",
                                        borderRadius: "0.2rem",
                                        border: "none",
                                        color: "#fff"
                                    }}>Check Pass</button>
                                </div>
                            </Form>
                        </Formik>
                    </div>

                </div>

                <div className="_tab">
                    <input hidden type="checkbox" id="chck20" />
                    <label className="_tab-label" htmlFor="chck20">
                        <div className="_grid_item">
                            <label className="_button_text">Users</label>
                            <div style={{ display: "flex", gridGap: "2rem" }}>
                                <div className="_icon_drop">&#10095;</div>
                                <input className="checkbox_name" type="checkbox" />
                            </div>

                        </div>

                    </label>

                    <div className="_tab-content">
                        <Formik onSubmit={onSubmit4} initialValues={initialValue}>
                            <Form ref={refForm}>
                                {user.map((item: any) => {
                                    return (
                                        <div className="content_flex">
                                            <div>{item.userName}</div> <Field className="checkbox_name" name="idp" type="checkbox" value={item._id} />
                                        </div>
                                    )
                                })}
                                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "1rem" }}>
                                    <button className="btn" type='submit' style={{
                                        background: "#37AFBF",
                                        padding: "0.4rem 1rem 0.4rem 1rem",
                                        borderRadius: "0.2rem",
                                        border: "none",
                                        color: "#fff"
                                    }}>Check Pass</button>
                                </div>
                            </Form>
                        </Formik>
                    </div>

                </div>
                <div className="_tab">
                    <input hidden type="checkbox" id="chck21" />
                    <label className="_tab-label" htmlFor="chck21">
                        <div className="_grid_item">
                            <label className="_button_text">Blogs</label>
                            <div style={{ display: "flex", gridGap: "2rem" }}>
                                <div className="_icon_drop">&#10095;</div>
                                <input className="checkbox_name" type="checkbox" />
                            </div>

                        </div>

                    </label>

                    <div className="_tab-content">
                        <Formik onSubmit={onSubmit5} initialValues={initialValue}>
                            <Form ref={refForm}>
                                {passblog.map((item: any) => {
                                    return (
                                        <div className="content_flex">
                                            <div>{item.name}</div> <Field className="checkbox_name" name="idp" type="checkbox" value={item._id} />
                                        </div>
                                    )
                                })}
                                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "1rem" }}>
                                    <button className="btn" type='submit' style={{
                                        background: "#37AFBF",
                                        padding: "0.4rem 1rem 0.4rem 1rem",
                                        borderRadius: "0.2rem",
                                        border: "none",
                                        color: "#fff"
                                    }}>Check Pass</button>
                                </div>
                            </Form>
                        </Formik>
                    </div>

                </div>

            </div>
        </>
    )
}
export default CheckPass