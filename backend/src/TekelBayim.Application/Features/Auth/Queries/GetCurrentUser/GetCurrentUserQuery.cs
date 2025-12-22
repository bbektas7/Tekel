using MediatR;
using TekelBayim.Application.Common.Interfaces;
using TekelBayim.Application.DTOs;

namespace TekelBayim.Application.Features.Auth.Queries.GetCurrentUser;

/// <summary>
/// Mevcut kullanıcı bilgilerini getir
/// </summary>
public record GetCurrentUserQuery(string UserId) : IRequest<UserMeResponse?>;

public class GetCurrentUserQueryHandler : IRequestHandler<GetCurrentUserQuery, UserMeResponse?>
{
    private readonly IAuthService _authService;

    public GetCurrentUserQueryHandler(IAuthService authService)
    {
        _authService = authService;
    }

    public async Task<UserMeResponse?> Handle(GetCurrentUserQuery request, CancellationToken cancellationToken)
    {
        return await _authService.GetCurrentUserAsync(request.UserId);
    }
}
