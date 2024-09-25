import React from 'react';
import { accounts } from './neraca-lajur';

const NeracaLajurTable: React.FC = () => {
    return (
        <table>
            <thead>
                <tr>
                    <th>Nomor Akun</th>
                    <th>Nama Akun</th>
                    <th>Pos Saldo</th>
                    <th>Neraca Debit</th>
                    <th>Neraca Kredit</th>
                    <th>Pos Laporan</th>
                    <th>Laba Rugi Debit</th>
                    <th>Laba Rugi Kredit</th>
                    <th>Neraca Saldo Debit</th>
                    <th>Neraca Saldo Kredit</th>
                </tr>
            </thead>
            <tbody>
                {accounts.map(account => (
                    <tr key={account.NomorAkun}>
                        <td>{account.NomorAkun}</td>
                        <td>{account.NamaAkun}</td>
                        <td>{account.PosSaldo}</td>
                        <td>{account.NeracaDebit}</td>
                        <td>{account.NeracaKredit}</td>
                        <td>{account.PosLaporan}</td>
                        <td>{account.LabaRugiDebit}</td>
                        <td>{account.LabaRugiKredit}</td>
                        <td>{account.NeracaSaldoDebit}</td>
                        <td>{account.NeracaSaldoKredit}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default NeracaLajurTable;