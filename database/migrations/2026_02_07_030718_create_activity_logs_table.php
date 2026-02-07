<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('activity_logs', function (Blueprint $table) {
            $table->id();

            // siapa yang melakukan
            $table->foreignId('actor_id')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            // siapa yang terkena aksi
            $table->foreignId('target_id')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            // jenis aksi
            $table->string('action');

            // data tambahan (json fleksibel)
            $table->json('meta')->nullable();

            $table->ipAddress('ip')->nullable();
            $table->text('user_agent')->nullable();

            $table->timestamps();

            // index biar cepat
            $table->index(['actor_id']);
            $table->index(['target_id']);
            $table->index(['action']);
            $table->index(['created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('activity_logs');
    }
};
