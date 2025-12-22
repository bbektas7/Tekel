using MediatR;
using TekelBayim.Application.DTOs;

namespace TekelBayim.Application.Features.Dashboard.Queries.GetDashboardSummary;

/// <summary>
/// Dashboard özet bilgileri
/// </summary>
public record GetDashboardSummaryQuery : IRequest<DashboardSummaryDto>;
