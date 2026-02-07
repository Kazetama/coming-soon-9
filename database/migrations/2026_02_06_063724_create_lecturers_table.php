<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('lecturers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('nidn')->unique()->nullable();
            $table->string('spesialisasi')->nullable()->nullable();
            $table->string('jabatan_fungsional')->nullable()->nullable();
            $table->timestamps();
        });
    }

        public function down(): void
    {
        Schema::dropIfExists('lecturers');
    }
};
