export const dataLaporanPosisiKeuangan = {
    institution: 'UD XXX XXX',
    document_name: 'LAPORAN PERUBAHAN MODAL',
    date: 'JANUARI 2024',
    data: {
        items: [
            {
                name: "ASET",
                items: [
                    {
                        name: "ASET LANCAR",
                        items: [
                            {
                                name: "Kas",
                                amount: 105375000
                            },
                            {
                                name: "Persediaan",
                                amount: 0
                            }
                        ],
                        total: {
                            name: "Total Aktiva Lancar",
                            amount: 105375000
                        }
                    },
                    {
                        name: "ASET TETAP",
                        items: [
                            {
                                name: "Lahan Pertanian",
                                amount: 0
                            },
                            {
                                name: "Mesin",
                                amount: 0
                            },
                            {
                                name: "Peralatan",
                                amount: 0
                            }
                        ],
                        total: {
                            name: "Total Aktiva Tetap",
                            amount: 0
                        }
                    },
                ],
                total: {
                    name: "Total Aktiva",
                    amount: 105375000
                }
            },
            {
                name: "KEWAJIBAN DAN MODAL",
                items: [
                    {
                        name: "KEWAJIBAN",
                        items: [
                            {
                                name: "Utang Usaha",
                                amount: 0
                            },
                            {
                                name: "Utang Bank",
                                amount: 0
                            },
                        ],
                        total: {
                            name: "Total Kewajiban",
                            amount: 0
                        }
                    },
                    {
                        name: "MODAL",
                        items: [
                            {
                                name: "Modal Pemilik",
                                amount: 0
                            },
                            {
                                name: "Modal Sumbangan",
                                amount: 100000000
                            },
                            {
                                name: "Saldo Laba",
                                amount: 5375000
                            },
                        ],
                        total: {
                            name: "Total Modal",
                            amount: 105375000
                        }
                    }
                ],
                total: {
                    name: "Total Kewajiban dan Modal",
                    amount: 105375000
                }
            }
        ]
    }
}