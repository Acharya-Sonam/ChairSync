using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class UpdateModels : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "OccupiedSince",
                table: "Chairs",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Admins",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Email = table.Column<string>(type: "text", nullable: false),
                    PasswordHash = table.Column<string>(type: "text", nullable: false),
                    ResetToken = table.Column<string>(type: "text", nullable: true),
                    ResetTokenExpiry = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Admins", x => x.Id);
                });

            migrationBuilder.UpdateData(
                table: "Chairs",
                keyColumn: "Id",
                keyValue: 1,
                column: "OccupiedSince",
                value: null);

            migrationBuilder.UpdateData(
                table: "Chairs",
                keyColumn: "Id",
                keyValue: 2,
                column: "OccupiedSince",
                value: null);

            migrationBuilder.UpdateData(
                table: "Chairs",
                keyColumn: "Id",
                keyValue: 3,
                column: "OccupiedSince",
                value: null);

            migrationBuilder.UpdateData(
                table: "Chairs",
                keyColumn: "Id",
                keyValue: 4,
                column: "OccupiedSince",
                value: null);

            migrationBuilder.UpdateData(
                table: "Chairs",
                keyColumn: "Id",
                keyValue: 5,
                column: "OccupiedSince",
                value: null);

            migrationBuilder.UpdateData(
                table: "Chairs",
                keyColumn: "Id",
                keyValue: 6,
                column: "OccupiedSince",
                value: null);

            migrationBuilder.UpdateData(
                table: "Chairs",
                keyColumn: "Id",
                keyValue: 7,
                column: "OccupiedSince",
                value: null);

            migrationBuilder.UpdateData(
                table: "Chairs",
                keyColumn: "Id",
                keyValue: 8,
                column: "OccupiedSince",
                value: null);

            migrationBuilder.UpdateData(
                table: "Chairs",
                keyColumn: "Id",
                keyValue: 9,
                column: "OccupiedSince",
                value: null);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Admins");

            migrationBuilder.DropColumn(
                name: "OccupiedSince",
                table: "Chairs");
        }
    }
}
