<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('abouts', function (Blueprint $table) {
            $table->id();
            $table->string('full_name');
            $table->string('professional_title');
            $table->text('short_intro')->nullable();
            $table->longText('description')->nullable();
            $table->string('profile_image')->nullable();
            $table->string('location')->nullable();
            $table->string('years_experience')->nullable();
            $table->longText('career_summary')->nullable();
            $table->longText('education_summary')->nullable();
            $table->json('highlights')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('abouts');
    }
};
