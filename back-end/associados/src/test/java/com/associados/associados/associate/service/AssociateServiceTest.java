package com.associados.associados.associate.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import static org.mockito.ArgumentMatchers.any;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import com.associados.associados.associate.dtos.request.UpdateAssociateDto;
import com.associados.associados.associate.dtos.request.UpdateSelfDeclarationDto;
import com.associados.associados.associate.dtos.response.AssociateResponseDto;
import com.associados.associados.associate.dtos.response.SelfDeclarationResponseDto;
import com.associados.associados.associate.entity.Address;
import com.associados.associados.associate.entity.Associate;
import com.associados.associados.associate.entity.Category;
import com.associados.associados.associate.entity.SelfDeclaration;
import com.associados.associados.associate.enums.EscolaridadeEnum;
import com.associados.associados.associate.enums.RendaEnum;
import com.associados.associados.associate.repository.AssociateRepository;
import com.associados.associados.associate.repository.CategoryRepository;
import com.associados.associados.auth.dtos.request.BaseRegisterDto;
import com.associados.associados.auth.dtos.request.RegisterAssociateDto;
import com.associados.associados.auth.infra.exceptions.BusinessException;
import com.associados.associados.user.entity.User;
import com.associados.associados.user.enums.RoleEnum;
import com.associados.associados.user.repository.UserRepository;

@ExtendWith(MockitoExtension.class)
class AssociateServiceTest {

    @Mock
    private AssociateRepository associateRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @InjectMocks
    private AssociateService associateService;

    private Category createMockCategory() {
        Category category = new Category();
        category.setId(UUID.randomUUID());
        category.setName("TI");
        return category;
    }

    private Associate createMockAssociate() {
        User user = new User();
        user.setId(UUID.randomUUID());
        user.setName("John Doe");
        user.setEmail("john@example.com");
        user.setRole(RoleEnum.ASSOCIATE);

        Associate associate = new Associate();
        associate.setId(UUID.randomUUID());
        associate.setCpf("12345678901");
        associate.setBirthDate(LocalDate.of(1990, 1, 1));
        associate.setUser(user);
        associate.setAddress(new Address());
        associate.setSelfDeclaration(new SelfDeclaration());
        associate.setWorkCategory(createMockCategory());
        return associate;
    }

    @Nested
    @DisplayName("Tests for register")
    class RegisterTests {

        @Test
        @DisplayName("Should register an adult associate successfully without guardian")
        void shouldRegisterAdultAssociateWithoutGuardian() {
            UUID categoryId = UUID.randomUUID();
                BaseRegisterDto base = new BaseRegisterDto(
                    "john@example.com", "password123", "John Doe", "12345678901", "11999999999"
                );

                RegisterAssociateDto dto = new RegisterAssociateDto(
                    base,
                    "John", 
                    "", 
                    LocalDate.now().minusYears(25),
                    categoryId,
                    "", 
                    "12345-678",
                    "Rua A",
                    "123",
                    "Bairro",
                    "Cidade",
                    "SP",
                    "Race",
                    "Gender",
                    "Hetero",
                    EscolaridadeEnum.SUPERIOR,
                    RendaEnum.MEDIA,
                    "",
                    "", 
                    true
                );

            when(userRepository.findByEmail(dto.email())).thenReturn(Optional.empty());
            when(categoryRepository.findById(categoryId)).thenReturn(Optional.of(createMockCategory()));

            associateService.register(dto);

            ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
            ArgumentCaptor<Associate> associateCaptor = ArgumentCaptor.forClass(Associate.class);

            verify(userRepository, times(1)).save(userCaptor.capture());
            verify(associateRepository, times(1)).save(associateCaptor.capture());

            User savedUser = userCaptor.getValue();
            Associate savedAssociate = associateCaptor.getValue();

            assertThat(savedUser.getRole()).isEqualTo(RoleEnum.ASSOCIATE);
            assertThat(savedAssociate.getLegalGuardianName()).isEmpty();
        }

        @Test
        @DisplayName("Should register a minor associate setting the legal guardian name")
        void shouldRegisterMinorAssociateWithGuardian() {

            UUID categoryId = UUID.randomUUID();
                BaseRegisterDto base = new BaseRegisterDto(
                    "minor@example.com", "password123", "Minor Doe", "12345678901", "11999999999"
                );

                RegisterAssociateDto dto = new RegisterAssociateDto(
                    base,
                    "Minor", 
                    "", 
                    LocalDate.now().minusYears(15),
                    categoryId,
                    "",
                    "12345-678",
                    "Rua A",
                    "123",
                    "Bairro",
                    "Cidade",
                    "SP",
                    "Race",
                    "Gender",
                    "Hetero",
                    EscolaridadeEnum.FUNDAMENTAL,
                    RendaEnum.BAIXA,
                    "",
                    "Jane Doe",
                    true
                );

            when(userRepository.findByEmail(dto.email())).thenReturn(Optional.empty());
            when(categoryRepository.findById(categoryId)).thenReturn(Optional.of(createMockCategory()));

            associateService.register(dto);

            ArgumentCaptor<Associate> associateCaptor = ArgumentCaptor.forClass(Associate.class);
            verify(associateRepository).save(associateCaptor.capture());
            assertThat(associateCaptor.getValue().getLegalGuardianName()).isEqualTo("Jane Doe");
        }

        @Test
        @DisplayName("Should throw IllegalArgumentException when CPF format is invalid")
        void shouldThrowExceptionWhenCpfIsInvalid() {
                BaseRegisterDto base = new BaseRegisterDto(
                    "email@test.com", "password123", "Name", "123", "11999999999"
                );

                RegisterAssociateDto dto = new RegisterAssociateDto(
                    base,
                    "", 
                    "", 
                    LocalDate.now(),
                    UUID.randomUUID(),
                    "",
                    "",
                    "",
                    "",
                    "",
                    "",
                    "",
                    "",
                    "",
                    "",
                    EscolaridadeEnum.FUNDAMENTAL,
                    RendaEnum.BAIXA,
                    "",
                    "",
                    true
                );

            assertThatThrownBy(() -> associateService.register(dto))
                    .isInstanceOf(IllegalArgumentException.class)
                    .hasMessage("Invalid CPF format");
        }
    }

    @Nested
    @DisplayName("Tests for getAllAssociates")
    class GetAllAssociatesTests {

        @Test
        @DisplayName("Should return a paged list of AssociateResponseDto")
        void shouldReturnPagedAssociates() {

            Pageable pageable = PageRequest.of(0, 10);
            Associate associate = createMockAssociate();
            Page<Associate> pagedResult = new PageImpl<>(List.of(associate));

            when(associateRepository.findAll(pageable)).thenReturn(pagedResult);

            Page<AssociateResponseDto> result = associateService.getAllAssociates(pageable);

            assertThat(result).isNotEmpty();
            assertThat(result.getContent().get(0).cpf()).isEqualTo("12345678901");
        }
    }

    @Nested
    @DisplayName("Tests for getAssociateById")
    class GetAssociateByIdTests {

        @Test
        @DisplayName("Should return AssociateResponseDto when found")
        void shouldReturnAssociateWhenIdExists() {
            UUID id = UUID.randomUUID();
            Associate associate = createMockAssociate();
            when(associateRepository.findById(id)).thenReturn(Optional.of(associate));

            AssociateResponseDto result = associateService.getAssociateById(id);

            assertThat(result).isNotNull();
            verify(associateRepository, times(1)).findById(id);
        }

        @Test
        @DisplayName("Should throw BusinessException when associate not found by ID")
        void shouldThrowExceptionWhenIdDoesNotExist() {
            UUID id = UUID.randomUUID();
            when(associateRepository.findById(id)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> associateService.getAssociateById(id))
                    .isInstanceOf(BusinessException.class)
                    .hasMessage("Associate not found");
        }
    }

    @Nested
    @DisplayName("Tests for getAssociateByUserId")
    class GetAssociateByUserIdTests {

        @Test
        @DisplayName("Should return AssociateResponseDto when found by userId")
        void shouldReturnAssociateWhenUserIdExists() {
            UUID userId = UUID.randomUUID();
            Associate associate = createMockAssociate();
            when(associateRepository.findByUserId(userId)).thenReturn(Optional.of(associate));

            AssociateResponseDto result = associateService.getAssociateByUserId(userId);

            assertThat(result).isNotNull();
        }
    }

    @Nested
    @DisplayName("Tests for updateAssociate")
    class UpdateAssociateTests {

        @Test
        @DisplayName("Should update associate fields successfully")
        void shouldUpdateFieldsSuccessfully() {
            UUID id = UUID.randomUUID();
            Associate existingAssociate = createMockAssociate();
            UpdateAssociateDto updateDto = new UpdateAssociateDto(
                "98765432100", 
                null, 
                null, 
                null, 
                "New Name", 
                null, 
                null, 
                null, 
                null, 
                null,
                null, 
                null, 
                null, 
                null, 
                null, 
                null,
                EscolaridadeEnum.FUNDAMENTAL,
                RendaEnum.BAIXA,
                null 
            );

            when(associateRepository.findById(id)).thenReturn(Optional.of(existingAssociate));
            when(associateRepository.findByCpf("98765432100")).thenReturn(Optional.empty());
            when(associateRepository.save(any(Associate.class))).thenAnswer(invocation -> invocation.getArgument(0));

            AssociateResponseDto result = associateService.updateAssociate(id, updateDto);

            assertThat(result).isNotNull();
            verify(associateRepository).save(existingAssociate);
            assertThat(existingAssociate.getUser().getName()).isEqualTo("New Name");
            assertThat(existingAssociate.getCpf()).isEqualTo("98765432100");
        }

        @Test
        @DisplayName("Should throw Exception when updating to a CPF already used by another associate")
        void shouldThrowExceptionWhenCpfAlreadyInUseByAnother() {
            UUID id = UUID.randomUUID();
            Associate existingAssociate = createMockAssociate();
            existingAssociate.setId(id);

            Associate otherAssociate = createMockAssociate();
            otherAssociate.setId(UUID.randomUUID());

            UpdateAssociateDto updateDto = new UpdateAssociateDto(
                    "98765432100", null, null, null, null, null, null, null, 
                    null, null, null, null, null, null, null, null, null, null, null
            );

            when(associateRepository.findById(id)).thenReturn(Optional.of(existingAssociate));
            when(associateRepository.findByCpf("98765432100")).thenReturn(Optional.of(otherAssociate));

            assertThatThrownBy(() -> associateService.updateAssociate(id, updateDto))
                    .isInstanceOf(IllegalArgumentException.class)
                    .hasMessage("CPF already registered");
        }
    }

    @Nested
    @DisplayName("Tests for updateSelfDeclaration")
    class UpdateSelfDeclarationTests {

        @Test
        @DisplayName("Should update self declaration data successfully")
        void shouldUpdateSelfDeclarationSuccessfully() {
            UUID userId = UUID.randomUUID();
            Associate associate = createMockAssociate();
                UpdateSelfDeclarationDto updateDto = new UpdateSelfDeclarationDto(
                    "New Social Name", "New Race", "New Gender", "New Orientation", EscolaridadeEnum.SUPERIOR, RendaEnum.MEDIA
                );

            when(associateRepository.findByUserId(userId)).thenReturn(Optional.of(associate));
            when(associateRepository.save(any(Associate.class))).thenAnswer(invocation -> invocation.getArgument(0));

            SelfDeclarationResponseDto result = associateService.updateSelfDeclaration(userId, updateDto);

            assertThat(result).isNotNull();
            assertThat(associate.getSelfDeclaration().getSocialName()).isEqualTo("New Social Name");
        }
    }

    @Nested
    @DisplayName("Tests for deleteAssociate")
    class DeleteAssociateTests {

        @Test
        @DisplayName("Should delete associate when it exists")
        void shouldDeleteWhenExists() {
            UUID id = UUID.randomUUID();
            when(associateRepository.existsById(id)).thenReturn(true);

            associateService.deleteAssociate(id);

            verify(associateRepository, times(1)).deleteById(id);
        }

        @Test
        @DisplayName("Should throw BusinessException when deleting unexisting associate")
        void shouldThrowExceptionWhenIdDoesNotExist() {
            UUID id = UUID.randomUUID();
            when(associateRepository.existsById(id)).thenReturn(false);

            assertThatThrownBy(() -> associateService.deleteAssociate(id))
                    .isInstanceOf(BusinessException.class)
                    .hasMessage("Associate not found");

            verify(associateRepository, never()).deleteById(any());
        }
    }
}