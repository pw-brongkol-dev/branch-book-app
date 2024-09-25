import React from 'react';
import { accounts } from './neraca-saldo'; // Pastikan path ini benar

const NeracaSaldoTable: React.FC = () => {
    return (
        <table>
            <thead>
                <tr>
                    <th>Nomor Akun</th>
                    <th>Nama Akun</th>
                    <th>Debit</th>
                    <th>Kredit</th>
                </tr>
            </thead>
            <tbody>
                {accounts.map((account) => (
                    <tr key={account.NomorAkun}>
                        <td>{account.NomorAkun}</td>
                        <td>{account.NamaAkun}</td>
                        <td>{account.Debit}</td>
                        <td>{account.Kredit}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default NeracaSaldoTable;
