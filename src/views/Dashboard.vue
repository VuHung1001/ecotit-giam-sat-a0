<script setup>
import { ref, onMounted } from 'vue'
import { useAppStatesStore } from '@/stores/appstates'
import Card from 'primevue/card';
import Chart from 'primevue/chart';
import DataTable from 'primevue/datatable';
import { useToast } from 'primevue/usetoast';
import Column from 'primevue/column';
const toast = useToast();
const documentStyle = getComputedStyle(document.body);
onMounted(async () => {
    useAppStatesStore().navbars = [{
        icon: 'pi pi-fw pi-file',
        label: 'HỆ THỐNG GIÁM SÁT VẬN HÀNH NGĂN VÀ THỜI GIAN THỰC',
        route: '/',
        visible: true
    }]
})
const giamSatTinhHinh = ref({
    search: {
        refresh: false,
        autoRefresh: localStorage.getItem('giamSatTinhHinh.autoRefresh') == 'T',
        date: [],
        factory: '',
        toMay: '',
        loaiBangChao: 'NGAY',
        icon: 'pi pi-check',
        cmd: function () {
            toast.add({ severity: 'success', summary: 'Trạng thái', detail: 'Cập nhật thành công', life: 3000 });
        }
    },
    data: {
        idNhaMay: '1',
        tenNhaMay: 'Nhà máy 1',
        toMays: [
            {
                idToMay: '1',
                columns: [
                    {
                        header: 'Công suất (MW)',
                        field: 'congsuat',
                    },
                    {
                        header: 'Scada',
                        field: 'scada',
                    },
                    {
                        header: 'DIM',
                        field: 'dim',
                    },
                    {
                        header: 'Lập lịch',
                        field: 'laplich',
                    },
                    {
                        header: 'Tỷ lệ sai lệch Scada - DIM',
                        field: 'tyledim',
                    },
                    {
                        header: 'Tỷ lệ sai lệch Scada - lập lịch',
                        field: 'tylelaplich',
                    }
                ],
                items: [
                    {
                        congsuat: 'P1',
                        scada: '85',
                        dim: '85',
                        laplich: '23',
                        tyledim: '85',
                        tylelaplich: '85'
                    },
                    {
                        congsuat: 'P2',
                        scada: '85',
                        dim: '85',
                        laplich: '23',
                        tyledim: '85',
                        tylelaplich: '85'
                    },
                    {
                        congsuat: 'P3',
                        scada: '85',
                        dim: '85',
                        laplich: '23',
                        tyledim: '85',
                        tylelaplich: '85'
                    },
                    {
                        congsuat: 'P4',
                        scada: '85',
                        dim: '85',
                        laplich: '23',
                        tyledim: '85',
                        tylelaplich: '85'
                    },
                    {
                        congsuat: 'P5',
                        scada: '85',
                        dim: '85',
                        laplich: '23',
                        tyledim: '85',
                        tylelaplich: '85'
                    },
                    {
                        congsuat: 'P6',
                        scada: '85',
                        dim: '85',
                        laplich: '23',
                        tyledim: '85',
                        tylelaplich: '85'
                    },
                ]
            },
        ],
        chartData: {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [
                {
                    label: 'Đường thực tế',
                    fill: false,
                    borderColor: 'blue',
                    yAxisID: 'y',
                    tension: 0,
                    data: [65, 59, 80, 81, 56, 55, 10]
                },
                {
                    label: 'Tương quan xu thế',
                    fill: false,
                    borderColor: 'red',
                    yAxisID: 'y1',
                    tension: 0,
                    data: [16, 17, 38, 19, 46, 17, 10]
                },
                {
                    label: 'Scada',
                    fill: false,
                    borderColor: 'yellow',
                    yAxisID: 'y1',
                    tension: 0,
                    data: [8, 41, 45, 12, 86, 26, 95]
                }
            ]
        },
        chartOptions: {
            stacked: false,
            maintainAspectRatio: false,
            aspectRatio: 0,
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: {
                        color: '#7c7c7c'
                    }
                }
            },
            elements: {
                point: {
                    radius: 1,
                    hoverRadius: 2, // ex.: to make it bigger when user hovers put larger number than radius.
                }
            },
            interaction: {
                intersect: false,
                axis: 'x'
            },
            scales: {
                x: {
                    ticks: {
                        color: '#7c7c7c'
                    },
                    grid: {
                        color: '#7c7c7c'
                    }
                },
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    ticks: {
                        color: '#7c7c7c',
                        callback: function (value) {
                            return value + '(MW)';
                        }
                    },
                    grid: {
                        color: '#7c7c7c'
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    min: 0,
                    max: 100,
                    ticks: {
                        color: '#7c7c7c',
                        callback: function (value) {
                            return value + '(%)';
                        }
                    },
                    grid: {
                        drawOnChartArea: false,
                        color: '#7c7c7c',
                    }
                }
            }
        },
        table2: [
            {
                id: 1000,
                nhaMay: 'Quốc Gia',
                toMay: 'p1',
                verified: true,
            },
            {
                id: 1001,
                nhaMay: 'Bắc',
                toMay: 'p2',
                verified: true,
            },
            {
                id: 1002,
                nhaMay: 'Trung',
                toMay: 'p3',
                verified: true,
            },
            {
                id: 1003,
                nhaMay: 'Nam',
                toMay: 'p4',
                verified: true,
            },
        ],
        table1: [
            {
                id: 1000,
                mien: 'Quốc Gia',
                phuTai: 'S1',
                duDong: '2',
                khaDung: '1',
                verified: true,
            },
            {
                id: 1001,
                mien: 'Bắc',
                phuTai: 'S2',
                duDong: '3',
                khaDung: '1',
                verified: true,
            },
            {
                id: 1002,
                mien: 'Trung',
                phuTai: 'S3',
                duDong: '2',
                khaDung: '11',
                verified: true,
            },
            {
                id: 1003,
                mien: 'Nam',
                phuTai: 'S11',
                duDong: '33',
                khaDung: '11',
                verified: true,
            },
        ],
        chartData1: {
            Title: 'Biểu đồ',
            labels: ['Thuỷ điện', 'Tuabin khí', 'Điện gió', 'Thuỷ điện nhỏ', 'Nhiệt điện dầu', 'Nhiệt điện khí', 'Nhiệt điện than', 'Điện mặt trời', 'Điện sinh khối', 'Điện mặt trời mái nhà', 'Nhập khẩu', 'Khác'],
            datasets: [
                {
                    data: [6, 4, 1, 35, 1, 1, 2, 1, 1, 51, 4, 2],
                    backgroundColor: [documentStyle.getPropertyValue('--blue-500'), documentStyle.getPropertyValue('--black-500-'), documentStyle.getPropertyValue('--cyan-400'), documentStyle.getPropertyValue('--blue-900'), documentStyle.getPropertyValue('--purple-500'), documentStyle.getPropertyValue('--indigo-500'), documentStyle.getPropertyValue('--orange-500'), documentStyle.getPropertyValue('--yellow-500'), documentStyle.getPropertyValue('--green-600'), documentStyle.getPropertyValue('--red-900'), documentStyle.getPropertyValue('--orange-900'), documentStyle.getPropertyValue('--pink-500')],
                    hoverBackgroundColor: [documentStyle.getPropertyValue('--blue-400'), documentStyle.getPropertyValue('--black-400'), documentStyle.getPropertyValue('--cyan-300'), documentStyle.getPropertyValue('--blue-800'), documentStyle.getPropertyValue('--purple-400'), documentStyle.getPropertyValue('--indigo-400'), documentStyle.getPropertyValue('--orange-400'), documentStyle.getPropertyValue('--yellow-400'), documentStyle.getPropertyValue('--green-500'), documentStyle.getPropertyValue('--red-800'), documentStyle.getPropertyValue('--orange-800'), documentStyle.getPropertyValue('--pink-400')]
                },
            ]
        },
        chartOptions1: {
            stacked: false,
            maintainAspectRatio: false,
            aspectRatio: 0,
            plugins: {
                legend: {
                    display: true,
                    position: 'left',
                    labels: {
                        color: localStorage.getItem('theme-mode') == 'light-mode' ? 'black' : 'white',
                        usePointStyle: true
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            var label = context.label || '';
                            var value = context.formattedValue;

                            if (context.dataset.data.length > 1) {
                                var percentage = ((context.parsed / context.dataset.data.reduce((a, b) => a + b)) * 100).toFixed(2) + '%';
                                label += ': ' + value + ' (' + percentage + ')';
                            } else {
                                label += ': ' + value;
                            }

                            return label;
                        }
                    }
                }
            }
        },
        chartData2: {
            labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14',],
            datasets: [
                {
                    type: 'line',
                    label: 'Dataset 1',
                    borderColor: documentStyle.getPropertyValue('--orange-500'),
                    borderWidth: 2,
                    fill: false,
                    tension: 0,
                    data: [21, 84, 24, 75, 37, 65, 34, 62, 31, 23, 46, 32, 0, 3]
                },
                {
                    type: 'bar',
                    label: 'Dataset 2',
                    backgroundColor: documentStyle.getPropertyValue('--blue-500'),
                    data: [21, 84, 24, 75, 37, 65, 34, 62, 31, 23, 46, 32, 0, 3],
                    borderColor: 'white',
                    borderWidth: 2
                }
            ]
        },
        chartOptions2: {
            maintainAspectRatio: false,
            aspectRatio: 0,
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: {
                        color: '#7c7c7c'
                    }
                }
            },
            elements: {
                point: {
                    radius: 1,
                    hoverRadius: 2, // ex.: to make it bigger when user hovers put larger number than radius.
                }
            },
            interaction: {
                intersect: false,
                axis: 'x'
            },
            scales: {
                x: {
                    ticks: {
                        color: '#7c7c7c'
                    },
                    grid: {
                        color: '#7c7c7c'
                    }
                },
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    ticks: {
                        color: '#7c7c7c',
                        callback: function (value) {
                            return value + '(MW)';
                        }
                    },
                    grid: {
                        color: '#7c7c7c'
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    min: 0,
                    max: 100,
                    ticks: {
                        color: '#7c7c7c',
                        callback: function (value) {
                            return value + '(%)';
                        }
                    },
                    grid: {
                        drawOnChartArea: false,
                        color: '#7c7c7c',
                    }
                }
            }
        }
    },
    actions: {
        refresh: {
            text: 'Tải lại dữ liệu',
            icon: 'pi pi-sync',
            cmd: async function () {
                giamSatTinhHinh.value.actions.refresh.icon = 'pi pi-spin pi-spinner';
                giamSatTinhHinh.value.search.refresh = true;
                await giamSatTinhHinh.value.search.cmd();
                giamSatTinhHinh.value.search.refresh = false;
                giamSatTinhHinh.value.actions.refresh.icon = 'pi pi-sync';
            }
        },
        exportExcel: {
            text: 'Xuất excel',
            icon: 'pi pi-file-excel',
            cmd: function () {
                toast.add({ severity: 'success', summary: 'Trạng thái', detail: 'Cập nhật thành công', life: 3000 });
            }
        },
        bieuDo: {
            changeRegion: function (code) {
                giamSatTinhHinh.value.data.tabActive = code
            }
        },
        autoRefreshChange: function () {
            localStorage.setItem('giamSatTinhHinh.autoRefresh', giamSatTinhHinh.value.search.autoRefresh ? 'T' : 'F')
        }
    },
    tableHight: (window.innerHeight - 250) + 'px'
})
</script>
<template>
    <div class="py-1 px-2">
        <div class="flex">
            <div class="col-3">
                <Card class="h-9rem" :pt="{
                    content: {
                        class: 'p-0'
                    }
                }">
                    <template #content>
                        <div class="mb-2">
                            <h4 class="m-0">
                                NM An Khánh gửi bản chào lúc: 10:00
                            </h4>
                            <h4 class="m-0">
                                NM AN Khê gửi bản chào lúc: 10:33
                            </h4>
                            <h4 class="m-0">
                                NM Bà Rịa gửi bản chào lúc: 10:55
                            </h4>
                        </div>
                        <div>
                            <h4 class="m-0">
                                Số NM chưa gửi bản chào: 20
                            </h4>
                            <h4 class="m-0">
                                Số NM cập nhật bản chào: 08
                            </h4>
                        </div>
                    </template>
                </Card>
            </div>
            <div class="col-3">
                <Card class="h-9rem align-content-center" :pt="{
                    content: {
                        class: 'p-0'
                    }
                }">
                    <template #content>
                        <h4 class="m-0 mb-3">
                            Ngừng máy/Khởi động: 3
                        </h4>
                        <h4 class="m-0 mb-3">
                            Thay đổi trạng thái vận hành: 6
                        </h4>
                        <h4 class="m-0">
                            Bản chào hoà lưới: 7
                        </h4>
                    </template>
                </Card>
            </div>
            <div class="col-3">
                <Card class="h-9rem align-content-center" :pt="{
                    content: {
                        class: 'p-0'
                    }
                }">
                    <template #content>
                        <div class="mb-2">
                            <h4 class="m-0">
                                Ngày tới
                            </h4>
                        </div>
                        <div>
                            <h4 class="m-0">
                                Tổng Huy động nguồn: 36000
                            </h4>
                            <h4 class="m-0">
                                Loại hình max:
                            </h4>
                            <h4 class="m-0">
                                Loại hình min:
                            </h4>
                        </div>
                    </template>
                </Card>
            </div>
            <div class="col-3">
                <Card class="h-9rem" :pt="{
                    content: {
                        class: 'p-0'
                    }
                }">
                    <template #content>
                        <div class="mb-2">
                            <h4 class="m-0">
                                Chu kỳ tới
                            </h4>
                        </div>
                        <div>
                            <h4 class="m-0">
                                Tổng huy động nguồn: 36000
                            </h4>
                            <h4 class="m-0">
                                Loại hình max:
                            </h4>
                            <h4 class="m-0">
                                Loại hình min:
                            </h4>
                        </div>
                    </template>
                </Card>
            </div>
        </div>
        <div class="flex">
            <div class="col-8">
                <div class="col-12 p-0">
                    <Chart class="relative" type="line" :data="giamSatTinhHinh.data.chartData"
                        :options="giamSatTinhHinh.data.chartOptions" :scrollHeight="giamSatTinhHinh.tableHight" :pt="{
                            root: {
                                class: 'w-full h-21rem'
                            }
                        }" />
                </div>
                <div class="col-12 p-0">
                    <Chart class="relative" type="bar" :data="giamSatTinhHinh.data.chartData2"
                        :options="giamSatTinhHinh.data.chartOptions2" :scrollHeight="giamSatTinhHinh.tableHight" :pt="{
                            root: {
                                class: 'w-full h-21rem'
                            }
                        }" />
                </div>
            </div>
            <div class="col-4">
                <div class="col-12 mb-5 p-0">
                    <DataTable :value="giamSatTinhHinh.data.table1" resizableColumns columnResizeMode="fit" showGridlines
                        stripedRows scrollable :scrollHeight="giamSatTinhHinh.tableHight">
                        <Column header="STT" headerStyle="width: 3rem"
                            class="border-bottom-1 surface-border px-0 py-0 text-center"
                            :pt="{ headerTitle: { class: 'text-center w-full' } }">
                            <template #body="slotProps">
                                {{ slotProps.index + 1 }}
                            </template>
                        </Column>
                        <Column field="mien" header="Miền" class="border-bottom-1 surface-border px-0 py-0 text-center"
                            :pt="{ headerTitle: { class: 'text-center w-full' } }"></Column>
                        <Column field="phuTai" header="Phụ tải" class="border-bottom-1 surface-border px-0 py-0 text-center"
                            :pt="{ headerTitle: { class: 'text-center w-full' } }"></Column>
                        <Column field="duDong" header="Dự dòng" class="border-bottom-1 surface-border px-0 py-0 text-center"
                            :pt="{ headerTitle: { class: 'text-center w-full' } }"></Column>
                        <Column field="khaDung" header="Khả dụng"
                            class="border-bottom-1 surface-border px-0 py-0 text-center"
                            :pt="{ headerTitle: { class: 'text-center w-full' } }"></Column>
                    </DataTable>
                </div>
                <div class="col-12 mb-7 p-0">
                    <DataTable :value="giamSatTinhHinh.data.table2" resizableColumns columnResizeMode="fit" showGridlines
                        stripedRows scrollable :scrollHeight="giamSatTinhHinh.tableHight">
                        <Column header="STT" headerStyle="width: 3rem"
                            class="border-bottom-1 surface-border px-0 py-0 text-center"
                            :pt="{ headerTitle: { class: 'text-center w-full' } }">
                            <template #body="slotProps">
                                {{ slotProps.index + 1 }}
                            </template>
                        </Column>
                        <Column field="nhaMay" header="Nhà máy" class="border-bottom-1 surface-border px-0 py-0 text-center"
                            :pt="{ headerTitle: { class: 'text-center w-full' } }"></Column>
                        <Column field="toMay" header="Tổ máy" class="border-bottom-1 surface-border px-0 py-0 text-center"
                            :pt="{ headerTitle: { class: 'text-center w-full' } }"></Column>
                    </DataTable>
                </div>
                <div class="col-12 p-0">
                    <Chart class="relative" type="pie" :data="giamSatTinhHinh.data.chartData1"
                        :options="giamSatTinhHinh.data.chartOptions1" :scrollHeight="giamSatTinhHinh.tableHight" />
                </div>
            </div>
        </div>
    </div>
</template>
