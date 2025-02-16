<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class ExportUserList implements FromCollection, WithHeadings
{
    protected $data;
    public function __construct($data)
    {
        $this->data = $data;
    }

    /**
    * @return \Illuminate\Support\Collection
    */
    public function collection()
    {
        return collect($this->data);
    }

    public function headings(): array
    {
        return [
            'Name',
            'Email',
            'Phone',
            'Position',
            'Role',
            'Created Date'
        ];
    }
}
