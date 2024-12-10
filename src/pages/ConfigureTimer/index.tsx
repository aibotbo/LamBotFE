import images from "assets";
import CustomButton from "components/CustomButton";
import MultipleSelect from "components/MultipleSelect";
import SelectInput from "components/SelectInput";
import TextInput from "components/TextInput";
import React, { useEffect, useState } from "react";
import List, { TypeFollowbotschedule } from "./list";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import APIs from "apis";
import InputSelectOption from "types/InputSelectOption";
import { useEnqueueSnackbar } from "hooks/useEnqueueSnackbar";
import './style.scss'
import { useAppSelector } from "stores/hooks";

interface ItemProp {
    thao_tac: string
    ten: string
    thoi_gian: number
    trang_thai: string
    checkbox?: string
    id: number
}

type TypeAutoBotList = {
    account_type: string
    aim_max: number
    aim_min: number
    config_name: string
    follower_name: string
    id: number
    // label: string
    // value: number
    [x: string]: any
}

interface TypeInitialValues {
    followbotschedule_name: string
    followbotid_group: number[]
    status: string
    hour_of_day: number
    minute_of_day: number
    [x: string]: any
}

const ConfigureTimer = () => {

    const [autoBotList, setAutoBotList] = useState<TypeAutoBotList[]>([])
    const user = useAppSelector((state) => state.user.user);
    const [selectedStatus, setSelectedStatus] = useState<InputSelectOption | null>(null)
    const enqueueSnackbar = useEnqueueSnackbar();
    const [refetch, setRefetch] = useState(0)
    const [firstSelect, setFirstSelect] = useState(true)
    const [selectedTimer, setSelectedTimer] = useState<TypeFollowbotschedule | null>(null)
    const [selectMulti, setSelectMulti] = useState<{
        first: boolean,
        selected: boolean
    }>({
        first: true,
        selected: false
    })

    const formikUpsert = useFormik({
        initialValues: {} as TypeInitialValues,
        validateOnChange: false,
        enableReinitialize: true,
        validationSchema: Yup.object({
            followbotschedule_name: Yup.string()
                .required('Vui lòng nhập tên cấu hình'),
            hour_of_day: Yup.string()
                .required('Vui lòng nhập giờ')
                .matches(
                    /^(?:[01]?\d|2[0-3])$/,
                    "Sai định dạng, Ex: 10"
                ),
            minute_of_day: Yup.string()
                .required('Vui lòng nhập phút')
                .matches(
                    /^(?:[1-9]?\d|[1-5]\d|0)$/,
                    "Sai định dạng, Ex: 59"
                )
        }),
        onSubmit: async (values, helpers) => {
            if (selectedStatus == null) {
                return
            }
            if (selectedTimer != null) {
                await axios.patch(`${APIs.followbotscheduleupdate}${selectedTimer.id}/`, {
                    ...values,
                    status: selectedStatus?.value,
                    id: selectedTimer.id,
                    o_owner: user.pk
                }).then(() => {
                    setRefetch((prev) => prev + 1)
                    enqueueSnackbar('Cập nhật hình thành công!', { variant: 'success' });
                }).catch((err) => {
                    enqueueSnackbar(
                        `${err.data
                            ? JSON.stringify(err.data)
                            : 'Cập nhật hình thất bại!'
                        }`,
                        { variant: 'error' }
                    );
                });
                setSelectedTimer(null)
            } else {
                await axios.post(APIs.followbotschedule, {
                    ...values,
                    status: selectedStatus?.value,
                    o_owner: user.pk
                }).then(() => {
                    setRefetch((prev) => prev + 1)
                    enqueueSnackbar('Thêm cấu hình thành công!', { variant: 'success' });
                }).catch((err) => {
                    enqueueSnackbar(
                        `${err.data
                            ? JSON.stringify(err.data)
                            : 'Thêm cấu hình thất bại!'
                        }`,
                        { variant: 'error' }
                    );
                });
            }
        },
    });

    const fetchAutoBotList = async () => {
        try {
            await axios.get(APIs.autoBotList).then((res) => {
                const arr: TypeAutoBotList[] | undefined = res.data?.results
                if (Array.isArray(arr)) {
                    setAutoBotList(arr)
                }
            })
        } catch (err) {

        }
    }

    useEffect(() => {
        fetchAutoBotList()
    }, [])

    return <div className="flex flex-col gap-4">
        <button
            className={`flex justify-center items-center gap-x-[0.625rem] px-4 py-2 rounded-xl col-span-2 md:col-auto flex-grow md:flex-initial button-add ${!selectedTimer ? 'cursor-not-allowed bg-ink-10 disable' : 'bg-primary-100'}`}
            onClick={() => {
                setSelectedTimer(null)
            }}
        >
            <img src={images.copy.plus} alt="BotLambotrade" />
            <p className="bg-background-100 bg-clip-text text-transparent font-semibold">
                Thêm mới
            </p>
        </button>
        <div className="grid grid-flow-row-dense lg:grid-cols-2 grid-rows-1 gap-4 md:grid-cols-1">
            <div className="p-6 h-fit bg-background-80 rounded-3xl">
                <h1 className="mb-6 text-xl font-semibold text-ink-100">{selectedTimer ? "Cập nhật" : 'Thêm mới'} cấu hình hẹn giờ {selectedTimer?.followbotschedule_name}</h1>
                <form onSubmit={formikUpsert.handleSubmit}>
                    <div className="flex flex-col gap-4">
                        <div className="flex justify-between gap-4">
                            <TextInput
                                fullWidth={true}
                                name="followbotschedule_name"
                                id="followbotschedule_name"
                                label="Tên cấu hình"
                                type="text"
                                onBlur={formikUpsert.handleBlur}
                                error={formikUpsert.errors.followbotschedule_name ? true : false}
                                helperText={
                                    formikUpsert.errors.followbotschedule_name ?? ''
                                }
                                placeholder="Tên cấu hình"
                                onChange={formikUpsert.handleChange}
                                value={formikUpsert.values?.followbotschedule_name} />
                            <SelectInput
                                value={selectedStatus}
                                label="Thao tác"
                                onBlur={formikUpsert.handleBlur}
                                onChange={(e) => {
                                    setSelectedStatus(e)
                                    setFirstSelect(false)
                                }}
                                name="status"
                                id="status"
                                error={(selectedStatus == null && !firstSelect) ? true : false}
                                helperText={
                                    (selectedStatus == null && !firstSelect) ?
                                        'Vui lòng chọn thao tác' : ''
                                }
                                options={[
                                    { label: 'Bắt đầu', value: 'start' },
                                    { label: 'Tắt Bot', value: 'stop' }
                                ]}
                                fullWidth
                            />
                        </div>
                        <div className="flex justify-between gap-4">
                            <TextInput
                                fullWidth={true}
                                name="hour_of_day"
                                id="hour_of_day"
                                label="Giờ 0->23"
                                type="string"
                                onBlur={formikUpsert.handleBlur}
                                error={
                                    formikUpsert.errors.hour_of_day ? true : false}
                                helperText={
                                    formikUpsert.errors.hour_of_day ?? ""
                                }
                                onChange={formikUpsert.handleChange}
                                placeholder="Giờ 0->23"
                                value={formikUpsert.values?.hour_of_day} />
                            <TextInput
                                fullWidth={true}
                                name="minute_of_day"
                                id="minute_of_day"
                                label="Phút 0->59"
                                type="string"
                                onBlur={formikUpsert.handleBlur}
                                error={
                                    formikUpsert.errors.minute_of_day ? true : false
                                }
                                helperText={
                                    formikUpsert.errors.minute_of_day ?? ""
                                }
                                onChange={formikUpsert.handleChange}
                                placeholder="Phút 0->59"
                                value={formikUpsert.values?.minute_of_day} />
                        </div>
                        <MultipleSelect
                            initialValue={selectedTimer?.followbotid}
                            error={selectMulti.first === false && selectMulti.selected === false ? "Vui lòng chọn cấu hình" : undefined}
                            list={autoBotList.map((e) => ({
                                label: e.config_name,
                                value: e.id
                            }))}
                            onSelected={(v) => {
                                formikUpsert.setFieldValue('followbotid', v.map((e) => e.value))
                                setSelectMulti({
                                    first: false,
                                    selected: v.length > 0
                                })
                            }} />
                        <h3 className="text-yellow-100">Lưu ý : Thời gian hẹn giờ sẽ tính theo múi giờ Việt Nam (+7)</h3>
                        <CustomButton textColor="text-white" onClick={() => {
                            setFirstSelect(false)
                            setSelectMulti((prev) => ({
                                ...prev,
                                first: false
                            }))
                            formikUpsert.handleSubmit()
                        }} icon={images.toast.warning} children={<>{selectedTimer ? 'Cập nhật' : 'Thêm'} cấu hình</>} />
                    </div>
                </form>
            </div>
            <List refetch={refetch} onSelectedTimer={(v) => {
                setSelectedStatus({
                    value: v.value.status,
                    label: v.value.status === 'start' ? 'Bắt đầu' : 'Tắt Bot'
                })
                formikUpsert.setFieldValue('followbotschedule_name', v.value.followbotschedule_name)
                formikUpsert.setFieldValue('hour_of_day', v.value.hour_of_day)
                formikUpsert.setFieldValue('minute_of_day', v.value.minute_of_day)
                formikUpsert.setFieldValue('followbotid', v.value.followbotid)
                setSelectedTimer(v.value)
            }} />
            {/*  */}
        </div>
    </div>
}

export default ConfigureTimer